import { buildSystemPrompt, MODEL, TOOLS } from '../../src/agent/prompt-config';
import { Channel, Locale } from '../../src/types';

describe('prompt-config', () => {
  it('declares the expected model and tools', () => {
    expect(MODEL).toBe('anthropic/claude-opus-4.5');
    const toolNames = TOOLS.map(tool => tool.function.name);
    expect(toolNames).toEqual([
      'get_medication_by_name',
      'check_store_inventory',
      'verify_prescription_requirement',
    ]);
  });

  it('includes channel instructions for chat mode', () => {
    const prompt = buildSystemPrompt(Channel.CHAT, Locale.EN);

    expect(prompt).toContain('CHANNEL: CHAT');
    expect(prompt).toContain('ALWAYS use tools to retrieve data');
    expect(prompt).toContain('MANDATORY TOOL USAGE - NO CACHING');
  });

  it('includes voice-specific reinforcement and German locale instructions', () => {
    const prompt = buildSystemPrompt(Channel.VOICE, Locale.DE);

    expect(prompt).toContain('CHANNEL: VOICE');
    expect(prompt).toContain('LANGUAGE: German');
    expect(prompt).toContain('Use formal "Sie" form');
  });
});
