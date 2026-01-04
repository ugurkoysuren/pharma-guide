/**
 * Guardrails Module - Defense in Depth
 *
 * Two layers of protection:
 * 1. INPUT GUARDRAILS: Pre-screen user messages before LLM call
 * 2. OUTPUT GUARDRAILS: Post-screen LLM responses before returning to user
 *
 * This ensures policy compliance even if the LLM makes mistakes.
 */

import { Locale } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export interface GuardrailResult {
  allowed: boolean;
  reason?: 'emergency' | 'medical_advice' | 'harmful_content' | 'policy_violation';
  overrideResponse?: string;
}

// ============================================================================
// PATTERNS (Multi-language: English + German)
// ============================================================================

// Emergency patterns with locale information
interface EmergencyPattern {
  pattern: RegExp;
  locale: Locale;
}

const EMERGENCY_PATTERNS: EmergencyPattern[] = [
  // English patterns
  { pattern: /\b(overdose|od['']?d)\b/i, locale: Locale.EN },
  { pattern: /\bcan['']?t breathe\b/i, locale: Locale.EN },
  { pattern: /\bheart attack\b/i, locale: Locale.EN },
  { pattern: /\b(suicide|suicidal|kill myself|end my life)\b/i, locale: Locale.EN },
  { pattern: /\bchest pain\b/i, locale: Locale.EN },
  { pattern: /\bseizure\b/i, locale: Locale.EN },
  { pattern: /\bunconscious\b/i, locale: Locale.EN },
  { pattern: /\bsevere allergic\b/i, locale: Locale.EN },
  { pattern: /\banaphyla/i, locale: Locale.EN },
  { pattern: /\btook too many\b/i, locale: Locale.EN },
  { pattern: /\bpoisoning\b/i, locale: Locale.EN },
  { pattern: /\bbleeding (heavily|won['']?t stop)\b/i, locale: Locale.EN },
  // German patterns
  { pattern: /\büberdosis\b/i, locale: Locale.DE },
  { pattern: /\bkann nicht atmen\b/i, locale: Locale.DE },
  { pattern: /\bherzinfarkt\b/i, locale: Locale.DE },
  { pattern: /\bselbstmord\b/i, locale: Locale.DE },
  { pattern: /\bbewusstlos\b/i, locale: Locale.DE },
  { pattern: /\bkrampfanfall\b/i, locale: Locale.DE },
  { pattern: /\ballergischer schock\b/i, locale: Locale.DE },
  { pattern: /\bzu viele (tabletten|pillen)\b/i, locale: Locale.DE },
  { pattern: /\bvergiftung\b/i, locale: Locale.DE },
];

const MEDICAL_ADVICE_PATTERNS = [
  // English - asking for recommendations
  /\bwhat (should|can|do) i take\b/i,
  /\bshould i (take|use|try)\b/i,
  /\bcan you (recommend|prescribe|suggest)\b/i,
  /\bwhat (medication|medicine|drug) (for|to treat)\b/i,
  /\bi have (a |an )?(headache|fever|pain|cough|cold).*what\b/i,
  /\btreat my\b/i,
  /\bcure (my|for)\b/i,
  /\bis .* (safe|good) for me\b/i,
  // German
  /\bwas soll ich (nehmen|einnehmen)\b/i,
  /\bkönnen sie .* empfehlen\b/i,
  /\bwelches medikament (für|gegen)\b/i,
  /\bich habe (kopfschmerzen|fieber|schmerzen).*was\b/i,
];

const HARMFUL_OUTPUT_PATTERNS = [
  // Patterns that should NEVER appear in LLM output
  /\byou should (take|try|use) .* for your\b/i,
  /\bi (recommend|suggest|advise) (taking|using)\b/i,
  /\btake \d+ (pills|tablets|mg) (to treat|for your)\b/i,
  /\bthis will (cure|treat|heal) your\b/i,
  /\bdiagnos(is|e|ed)\b.*\byou (have|might have|probably have)\b/i,
  // German
  /\bsie sollten .* (nehmen|einnehmen) (für|gegen) ihre\b/i,
  /\bich empfehle (ihnen )?(die einnahme|zu nehmen)\b/i,
];

// ============================================================================
// EMERGENCY RESPONSES (Immediate, no LLM needed)
// ============================================================================

const EMERGENCY_RESPONSES: Record<Locale, string> = {
  [Locale.EN]: `⚠️ **This sounds like a medical emergency.**

**Please take immediate action:**
- **Call 911** (US) or **112** (Europe) immediately
- Go to the **nearest emergency room**
- **Do not wait** - seek help now

If you're with someone else, have them call while you stay on the line.

I'm a pharmacy assistant and cannot provide emergency medical care. Please contact emergency services right away.`,

  [Locale.DE]: `⚠️ **Das klingt nach einem medizinischen Notfall.**

**Bitte handeln Sie sofort:**
- Rufen Sie **112** (Notruf) sofort an
- Gehen Sie zur **nächsten Notaufnahme**
- **Warten Sie nicht** - holen Sie sich jetzt Hilfe

Wenn jemand bei Ihnen ist, lassen Sie diese Person anrufen.

Ich bin ein Apotheken-Assistent und kann keine medizinische Notfallversorgung leisten. Bitte kontaktieren Sie sofort den Rettungsdienst.`,
};

const MEDICAL_ADVICE_RESPONSES: Record<Locale, string> = {
  [Locale.EN]: `I understand you're looking for guidance, but I'm not able to recommend specific medications for symptoms or conditions. This would be medical advice that should come from a qualified healthcare professional.

**Please consult:**
- A **pharmacist** in-store for over-the-counter guidance
- Your **doctor** or healthcare provider
- A **health helpline** in your area

I'm happy to provide factual information about specific medications if you have questions about a particular product.`,

  [Locale.DE]: `Ich verstehe, dass Sie nach Rat suchen, aber ich kann keine spezifischen Medikamente für Symptome oder Beschwerden empfehlen. Dies wäre eine medizinische Beratung, die von einem qualifizierten Arzt kommen sollte.

**Bitte wenden Sie sich an:**
- Einen **Apotheker** vor Ort für Beratung zu rezeptfreien Medikamenten
- Ihren **Arzt** oder Gesundheitsdienstleister
- Eine **Gesundheits-Hotline** in Ihrer Nähe

Ich kann Ihnen gerne sachliche Informationen über bestimmte Medikamente geben, wenn Sie Fragen zu einem bestimmten Produkt haben.`,
};

// ============================================================================
// INPUT GUARDRAILS (Pre-screening)
// ============================================================================

export function screenInput(message: string, locale: Locale = Locale.EN): GuardrailResult {
  // Check for emergencies FIRST (highest priority)
  // Use the pattern's locale if it matches, so German input gets German response
  for (const { pattern, locale: patternLocale } of EMERGENCY_PATTERNS) {
    if (pattern.test(message)) {
      // Use the pattern's locale (detected from input language) for the response
      const responseLocale = patternLocale;
      console.log(`[GUARDRAIL] Emergency detected: ${pattern} (responding in ${responseLocale})`);
      return {
        allowed: false,
        reason: 'emergency',
        overrideResponse: EMERGENCY_RESPONSES[responseLocale],
      };
    }
  }

  // Check for medical advice requests
  for (const pattern of MEDICAL_ADVICE_PATTERNS) {
    if (pattern.test(message)) {
      console.log(`[GUARDRAIL] Medical advice request detected: ${pattern}`);
      return {
        allowed: false,
        reason: 'medical_advice',
        overrideResponse: MEDICAL_ADVICE_RESPONSES[locale],
      };
    }
  }

  // Allow the message to proceed to LLM
  return { allowed: true };
}

// ============================================================================
// OUTPUT GUARDRAILS (Post-screening)
// ============================================================================

export function screenOutput(response: string, locale: Locale = Locale.EN): GuardrailResult {
  // Check if LLM accidentally provided medical advice
  for (const pattern of HARMFUL_OUTPUT_PATTERNS) {
    if (pattern.test(response)) {
      console.log(`[GUARDRAIL] Harmful output detected: ${pattern}`);
      return {
        allowed: false,
        reason: 'policy_violation',
        overrideResponse: MEDICAL_ADVICE_RESPONSES[locale],
      };
    }
  }

  // Response is safe
  return { allowed: true };
}

// ============================================================================
// SAFETY DISCLAIMER (Appended to medication info)
// ============================================================================

const SAFETY_DISCLAIMERS: Record<Locale, string> = {
  [Locale.EN]:
    '\n\n---\n*This information is for educational purposes only. Always consult a healthcare professional before taking any medication.*',
  [Locale.DE]:
    '\n\n---\n*Diese Informationen dienen nur zu Bildungszwecken. Konsultieren Sie immer einen Arzt, bevor Sie Medikamente einnehmen.*',
};

export function addSafetyDisclaimer(response: string, locale: Locale = Locale.EN): string {
  // Only add if response contains medication info (check for common patterns)
  const hasMedicationInfo =
    /\b(mg|milligram|dosage|dose|tablet|capsule|active ingredient|warning)\b/i.test(response) ||
    /\b(Dosierung|Tablette|Kapsel|Wirkstoff|Warnung)\b/i.test(response);

  if (hasMedicationInfo && !response.includes('educational purposes') && !response.includes('Bildungszwecken')) {
    return response + SAFETY_DISCLAIMERS[locale];
  }

  return response;
}
