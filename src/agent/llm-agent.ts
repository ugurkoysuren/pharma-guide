import type OpenAI from 'openai';
import { Channel, Locale } from '../types';
import { executeTool } from '../tools';
import { screenInput, screenOutput, addSafetyDisclaimer } from './guardrails';
import { getChatCompletionsClient } from './chat-client';
import { MODEL, TOOLS, buildSystemPrompt } from './prompt-config';

export { setChatCompletionsClient, resetChatCompletionsClient } from './chat-client';
export type { ChatCompletionsClient } from './chat-client';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ClaudeAgent {
  private channel: Channel;
  private locale: Locale;
  private conversationHistory: OpenAI.ChatCompletionMessageParam[] = [];

  constructor(channel: Channel = Channel.CHAT, locale: Locale = Locale.EN) {
    this.channel = channel;
    this.locale = locale;
  }

  setChannel(channel: Channel): void {
    this.channel = channel;
  }

  setLocale(locale: Locale): void {
    this.locale = locale;
  }

  getChannel(): Channel {
    return this.channel;
  }

  getLocale(): Locale {
    return this.locale;
  }

  /**
   * Generate channel reinforcement message to remind LLM of current mode
   */
  private getChannelReinforcementMessage(): string {
    if (this.channel === Channel.VOICE) {
      return `⚠️ [SYSTEM] You are now in VOICE MODE. Your response will be SPOKEN ALOUD.
STRICT VOICE MODE REQUIREMENTS:
- MAXIMUM 3 SENTENCES TOTAL - ABSOLUTELY NO EXCEPTIONS
- NO LISTS or BULLET POINTS - use flowing sentences only
- NO MARKDOWN FORMATTING - plain text only
- Spell out all units: "500 milligrams" not "500mg"
- Confirm actions explicitly: "I'm checking inventory now..."
- WRONG: "Active ingredients: Loratadine. Dosage: Take one..."
- CORRECT: "Claritin contains loratadine. Take one tablet daily."

ABSOLUTE PROHIBITIONS:
- NEVER output JSON objects like {"follow_ups": [...]}
- For prescription questions, USE THE verify_prescription_requirement TOOL`;
    }

    return `⚠️ [SYSTEM] You are now in CHAT MODE. User reads text on screen.
CHAT MODE RECOMMENDATIONS:
- Use markdown formatting (bold, lists, headers)
- Provide detailed, structured responses
- Use bullet points for multiple items
- Include section headers
- CRITICAL: Use DOUBLE NEWLINES (blank lines) between ALL sections and paragraphs
- Example format: "**Heading**\n\nContent\n\n**Next:**\n\nText"

ABSOLUTE PROHIBITIONS:
- NEVER output JSON objects like {"follow_ups": [...]} or {"tags": [...]}
- NEVER output raw JSON in your response
- ALL output must be natural language readable by humans
- For prescription questions, USE THE verify_prescription_requirement TOOL`;
  }

  async processMessage(userMessage: string): Promise<string> {
    // =========================================================================
    // LAYER 1: INPUT GUARDRAILS (Pre-screening)
    // =========================================================================
    const inputCheck = screenInput(userMessage, this.locale);
    if (!inputCheck.allowed) {
      console.log(`[GUARDRAIL] Input blocked: ${inputCheck.reason}`);
      // Add to history for context continuity
      this.conversationHistory.push({ role: 'user', content: userMessage });
      this.conversationHistory.push({ role: 'assistant', content: inputCheck.overrideResponse! });
      return inputCheck.overrideResponse!;
    }

    // =========================================================================
    // LAYER 1.5: CHANNEL REINFORCEMENT (Remind LLM of current mode)
    // =========================================================================
    const channelReinforcement = this.getChannelReinforcementMessage();

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    // Call LLM with tools
    // Temperature 0 for factual, deterministic responses (per prompt engineering best practices)
    const client = getChatCompletionsClient();

    let response = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      temperature: 0,
      messages: [
        { role: 'system', content: buildSystemPrompt(this.channel, this.locale) },
        { role: 'system', content: channelReinforcement },
        ...this.conversationHistory,
      ],
      tools: TOOLS,
    });

    let assistantMessage = response.choices[0].message;

    // Handle tool use loop
    while (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolCalls = assistantMessage.tool_calls as Array<{
        id: string;
        type: 'function';
        function: { name: string; arguments: string };
      }>;

      console.log('Tool calls:', toolCalls.map(tc => tc.function.name));

      // Add assistant message to history
      this.conversationHistory.push(assistantMessage);

      // Process all tool calls
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        console.log(`Executing tool: ${functionName}`, functionArgs);

        // Execute the tool
        const result = executeTool({
          name: functionName as 'get_medication_by_name' | 'check_store_inventory' | 'verify_prescription_requirement',
          payload: functionArgs,
        });

        console.log(`Tool result:`, result);

        // Add tool result to history
        this.conversationHistory.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      // Continue the conversation
      response = await client.chat.completions.create({
        model: MODEL,
        max_tokens: 1024,
        temperature: 0,
        messages: [
          { role: 'system', content: buildSystemPrompt(this.channel, this.locale) },
          ...this.conversationHistory,
        ],
        tools: TOOLS,
      });

      assistantMessage = response.choices[0].message;
    }

    // Extract final text response
    let textResponse = assistantMessage.content || '';

    // =========================================================================
    // LAYER 2: OUTPUT GUARDRAILS (Post-screening)
    // =========================================================================
    const outputCheck = screenOutput(textResponse, this.locale);
    if (!outputCheck.allowed) {
      console.log(`[GUARDRAIL] Output blocked: ${outputCheck.reason}`);
      textResponse = outputCheck.overrideResponse!;
    } else {
      // Add safety disclaimer to medication info responses
      textResponse = addSafetyDisclaimer(textResponse, this.locale);
    }

    // Add assistant response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: textResponse,
    });

    return textResponse;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}
