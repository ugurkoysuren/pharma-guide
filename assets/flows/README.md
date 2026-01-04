# Evidence Collection Directory

This directory contains screenshots and evidence for the PharmaGuide agent showcase.

## Directory Structure

```
assets/
├── flows/
│   ├── flow1-medication-info/     # Flow 1 evidence
│   ├── flow2-stock-availability/  # Flow 2 evidence
│   ├── flow3-allergy-safety/      # Flow 3 evidence
│   └── flow4-crisis-guardrails/   # Flow 4 evidence
├── transcripts/                   # Conversation transcripts
└── summary.md                     # Evidence summary
```

## Screenshot Naming Convention

- `flow{number}-{locale}-{channel}-{testcase}.png`
- Examples:
  - `flow1-en-chat-01.png` - Flow 1, English, Chat, Test Case 1
  - `flow1-en-voice-01.png` - Flow 1, English, Voice, Test Case 1
  - `flow1-de-chat-01.png` - Flow 1, German, Chat, Test Case 1
  - `flow2-en-chat-01.png` - Flow 2, English, Chat, Test Case 1
  - `flow2-en-voice-01.png` - Flow 2, English, Voice, Test Case 1

## Required Screenshots

### Flow 1 - Medication Information (Multi-Step)
- [ ] `flow1-en-chat-01.png` - Claritin info → Prescription verification (English chat)
- [ ] `flow1-en-voice-01.png` - Claritin info → Prescription verification (English voice)
- [ ] `flow1-de-chat-01.png` - Claritin info → Prescription verification (German chat)

**Multi-Step Flow:** User asks about medication → Agent provides info → User asks about prescription → Agent verifies → Complete answer

### Flow 2 - Stock Availability (Multi-Step)
- [ ] `flow2-en-chat-01.png` - Missing store → Stock check → Prescription verification (English chat)
- [ ] `flow2-en-voice-01.png` - Missing store → Stock check → Prescription verification (English voice)
- [ ] `flow2-de-chat-01.png` - Missing store → Stock check → Prescription verification (German chat)

**Multi-Step Flow:** User asks about stock → Agent asks for store → User provides store → Agent checks inventory → User asks about prescription → Agent verifies → Complete guidance

### Flow 3 - Allergy/Safety (Multi-Step)
- [ ] `flow3-en-chat-01.png` - Allergy concern → Medication info → Stock check (English chat)
- [ ] `flow3-en-voice-01.png` - Allergy concern → Medication info → Stock check (English voice)
- [ ] `flow3-en-chat-02.png` - Medical advice refusal (2-step interaction)
- [ ] `flow3-de-chat-01.png` - Allergy concern → Medication info → Stock check (German chat)

**Multi-Step Flow:** User mentions allergy → Agent provides medication info with safety disclaimer → User asks about stock → Agent checks inventory → Complete answer with safety reminder

### Flow 4 - Crisis/Emergency Guardrails
- [ ] `flow4-en-chat-01.png` - Suicide/crisis detection → Emergency response (English)
- [ ] `flow4-en-chat-02.png` - Overdose detection → Emergency response (English)
- [ ] `flow4-de-chat-01.png` - Crisis detection → Emergency response (German)

**Guardrail Flow:** User mentions crisis keywords → Input guardrail intercepts BEFORE LLM → Immediate emergency response → No tool calls, no LLM involvement

**Purpose:** Demonstrates that sensitive/crisis content is handled safely at the guardrail layer, never reaching the LLM.

## Transcript Files

All transcripts are stored in `assets/transcripts/`:

### Flow 1:
- `flow1-en-01.md` - English chat (multi-step)
- `flow1-en-voice-01.md` - English voice (multi-step)
- `flow1-de-01.md` - German chat (multi-step)

### Flow 2:
- `flow2-en-01.md` - English chat (multi-step)
- `flow2-en-voice-01.md` - English voice (multi-step)
- `flow2-de-01.md` - German chat (multi-step)

### Flow 3:
- `flow3-en-01.md` - Allergy concern (multi-step)
- `flow3-en-voice-01.md` - Allergy concern voice (multi-step)
- `flow3-en-02.md` - Medical advice refusal (2-step)
- `flow3-de-01.md` - Allergy concern German (multi-step)

### Flow 4:
- `flow4-en-01.md` - Crisis/suicide guardrail tests (English)
- `flow4-de-01.md` - Crisis guardrail tests (German)

## Notes

- Screenshots should show the complete multi-step conversation flow
- Each step should show: User message → TOOL CALL → TOOL RESPONSE → Agent response
- Include annotations where helpful (flow name, test case ID, step number, timestamp)
- Ensure screenshots are clear and readable
- Multi-step flows demonstrate:
  - Sequential tool calls
  - User follow-up questions
  - Agent asking for missing information
  - Progressive information gathering
