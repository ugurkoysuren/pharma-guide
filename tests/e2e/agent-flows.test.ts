import {
  ClaudeAgent,
  setChatCompletionsClient,
  resetChatCompletionsClient,
  ChatCompletionsClient,
} from '../../src/agent/llm-agent';
import { Channel, Locale, ToolName } from '../../src/types';
import { screenInput } from '../../src/agent/guardrails';

const runE2E = ['true', '1', 'yes'].includes((process.env.RUN_E2E || '').toLowerCase());
const describeE2E = runE2E ? describe : describe.skip;

interface MockToolCall {
  name: ToolName;
  args: Record<string, unknown>;
}

interface MockAssistantFrame {
  content?: string;
  toolCalls?: MockToolCall[];
}

class MockOpenAI implements ChatCompletionsClient {
  private frames: MockAssistantFrame[];
  public callCount = 0;

  constructor(frames: MockAssistantFrame[]) {
    this.frames = frames;
  }

  chat = {
    completions: {
      create: async (_params: unknown) => {
        if (this.callCount >= this.frames.length) {
          throw new Error(
            `Received more LLM calls (${this.callCount + 1}) than scripted frames (${this.frames.length})`
          );
        }

        const frame = this.frames[this.callCount];
        this.callCount += 1;

        return {
          choices: [
            {
              message: {
                role: 'assistant',
                content: frame.content ?? null,
                tool_calls: frame.toolCalls?.map((call, idx) => ({
                  id: `call-${this.callCount}-${idx + 1}`,
                  type: 'function' as const,
                  function: {
                    name: call.name,
                    arguments: JSON.stringify(call.args),
                  },
                })),
              },
            },
          ],
        };
      },
    },
  };
}

const toolCall = (name: ToolName, args: Record<string, unknown>): MockToolCall => ({
  name,
  args,
});

describeE2E('ClaudeAgent end-to-end showcase flows', () => {
  afterEach(() => {
    resetChatCompletionsClient();
  });

  it('Flow 1 (Medication info + prescription follow-up)', async () => {
    const mock = new MockOpenAI([
      {
        content: 'Let me look up that information for you.',
        toolCalls: [
          toolCall('get_medication_by_name', { name: 'Claritin', strength_mg: 10, locale: 'en' }),
        ],
      },
      {
        content: [
          '**Claritin 10mg**',
          '',
          '**Active Ingredient:**',
          '',
          '- Loratadine (10mg)',
          '',
          '**Dosage Instructions:**',
          '',
          '- Take 1 tablet once daily. Do not exceed recommended dose.',
          '',
          '**Warnings:**',
          '',
          '- May cause drowsiness',
          '- Avoid alcohol',
          '',
          '*Source: get_medication_by_name*',
        ].join('\n'),
      },
      {
        content: 'Let me verify the prescription requirements for Claritin 10mg.',
        toolCalls: [
          toolCall('verify_prescription_requirement', { medication_name: 'Claritin', strength_mg: 10 }),
        ],
      },
      {
        content: [
          '**Prescription Status:**',
          '',
          '- No prescription required ✅ (over-the-counter)',
          '',
          '**Notes:**',
          '',
          '- Available over-the-counter without prescription',
          '',
          '*Source: verify_prescription_requirement*',
        ].join('\n'),
      },
    ]);
    setChatCompletionsClient(mock);

    const agent = new ClaudeAgent(Channel.CHAT, Locale.EN);

    const medicationInfo = await agent.processMessage(
      'What are the active ingredients and dosage instructions for Claritin 10mg?'
    );

    expect(medicationInfo).toContain('Claritin 10mg');
    expect(medicationInfo).toContain('Active Ingredient');
    expect(medicationInfo).toContain('This information is for educational purposes only.');

    const prescriptionInfo = await agent.processMessage('Do I need a prescription for this?');

    expect(prescriptionInfo).toContain('No prescription required');
    expect(prescriptionInfo).toContain('verify_prescription_requirement');
    expect(mock.callCount).toBe(4);
  });

  it('Flow 2 (Stock request ➝ store prompt ➝ inventory + prescription)', async () => {
    const mock = new MockOpenAI([
      {
        content: [
          "I'd be happy to check Omeprazole 20mg availability for you. Which store location would you like me to check?",
          '',
          '- NYC-014 (New York Midtown)',
          '- NYC-015 (New York Downtown)',
          '- BER-001 (Berlin Mitte)',
        ].join('\n'),
      },
      {
        content: "I'm checking the inventory for store NYC-014.",
        toolCalls: [
          toolCall('check_store_inventory', {
            store_id: 'NYC-014',
            medication_name: 'Omeprazole',
            strength_mg: 20,
            quantity: 1,
          }),
        ],
      },
      {
        content: [
          '**Stock Check: Omeprazole 20mg at NYC-014**',
          '',
          '**Status:**',
          '',
          '✓ In Stock',
          '',
          '- Available quantity: 34 units',
          '- Pickup: Available for same-day pickup',
          '',
          '*Source: check_store_inventory*',
        ].join('\n'),
      },
      {
        content: 'Let me verify the prescription requirements for Omeprazole 20mg.',
        toolCalls: [
          toolCall('verify_prescription_requirement', {
            medication_name: 'Omeprazole',
            strength_mg: 20,
          }),
        ],
      },
      {
        content: [
          '**Prescription Requirement: Omeprazole 20mg**',
          '',
          '**Prescription Required:**',
          '',
          '- Yes',
          '',
          '**Accepted From:**',
          '',
          '- Physician',
          '- Nurse Practitioner',
          '',
          '**Notes:**',
          '',
          '- Valid prescription must be less than 6 months old',
          '',
          '*Source: verify_prescription_requirement*',
          '',
          'Please note: Omeprazole 20mg requires a valid prescription. You will need to bring it to store NYC-014 for pickup.',
        ].join('\n'),
      },
    ]);
    setChatCompletionsClient(mock);

    const agent = new ClaudeAgent(Channel.CHAT, Locale.EN);

    const missingStorePrompt = await agent.processMessage('Is Omeprazole 20mg in stock?');
    expect(missingStorePrompt).toContain('Which store location');
    expect(missingStorePrompt).toContain('NYC-014');

    const stockResponse = await agent.processMessage('NYC-014');
    expect(stockResponse).toContain('Omeprazole 20mg at NYC-014');
    expect(stockResponse).toContain('In Stock');

    const prescriptionResponse = await agent.processMessage('Do I need a prescription to buy this?');
    expect(prescriptionResponse).toContain('Prescription Requirement');
    expect(prescriptionResponse).toContain('Valid prescription must be less than 6 months old');
    expect(mock.callCount).toBe(5);
  });

  it('Flow 4 (Emergency guardrail blocks LLM call)', async () => {
    const emergencyMessage = "I want to end my life. What pills would do that quickly?";
    const mock = new MockOpenAI([]);
    setChatCompletionsClient(mock);

    const agent = new ClaudeAgent(Channel.CHAT, Locale.EN);
    const response = await agent.processMessage(emergencyMessage);

    const guardrailPreview = screenInput(emergencyMessage, Locale.EN);
    expect(guardrailPreview.allowed).toBe(false);
    expect(response).toBe(guardrailPreview.overrideResponse);
    expect(mock.callCount).toBe(0);
  });
});
