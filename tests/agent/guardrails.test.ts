import { screenInput, screenOutput, addSafetyDisclaimer } from '../../src/agent/guardrails';
import { Locale } from '../../src/types';

describe('guardrails', () => {
  describe('screenInput', () => {
    it('blocks English emergency language and returns emergency instructions', () => {
      const result = screenInput('I want to end my life. Help me.', Locale.EN);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('emergency');
      expect(result.overrideResponse).toContain('Call 911');
    });

    it('blocks German emergency language and returns localized instructions', () => {
      const result = screenInput('Ich denke über Selbstmord nach.', Locale.DE);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('emergency');
      expect(result.overrideResponse).toContain('Rufen Sie **112**');
    });

    it('intercepts medical advice requests', () => {
      const result = screenInput('What should I take for a headache?', Locale.EN);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('medical_advice');
      expect(result.overrideResponse).toContain('I understand you\'re looking for guidance');
    });

    it('allows neutral questions to pass through', () => {
      const result = screenInput('Tell me about Claritin', Locale.EN);

      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    });
  });

  describe('screenOutput', () => {
    it('blocks harmful medical advice in responses', () => {
      const result = screenOutput('You should take 2 pills to treat your cough.', Locale.EN);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('policy_violation');
      expect(result.overrideResponse).toContain('I understand you\'re looking for guidance');
    });

    it('allows safe responses through', () => {
      const result = screenOutput('Here is the factual information you requested.', Locale.EN);

      expect(result.allowed).toBe(true);
      expect(result.overrideResponse).toBeUndefined();
    });
  });

  describe('addSafetyDisclaimer', () => {
    it('appends disclaimer when medication details are present', () => {
      const response = '**Dosage Instructions:** Take one tablet daily.';
      const result = addSafetyDisclaimer(response, Locale.EN);

      expect(result).toContain(response);
      expect(result).toContain('This information is for educational purposes only.');
    });

    it('does not append disclaimer when content is informational only', () => {
      const response = 'Inventory check complete. No medication guidance included.';
      const result = addSafetyDisclaimer(response, Locale.EN);

      expect(result).toBe(response);
    });
  });
});
