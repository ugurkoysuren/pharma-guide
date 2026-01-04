# OpenWebUI Setup Guide for PharmaGuide

## PHASE 1: OpenWebUI Configuration

### Step 1: Access OpenWebUI
1. Access OpenWebUI at your deployment URL
2. Log in to your OpenWebUI instance

### Step 2: Prepare OpenWebUI Setup
1. Create a new agent (or configure existing one):
   - **Name:** PharmaGuide - ACME Pharmacy
   - **Description:** AI pharmacist assistant for ACME Retail Pharmacy
   - **Model:** Select your model (e.g., GPT-4, Claude, etc.)
   - **Temperature:** 0.3 (lower for factual responses)
   - **Max tokens:** 1000-1500

### Step 3: Configure System Prompt
Copy this into OpenWebUI's system prompt section:

```
You are "PharmaGuide", an AI pharmacist assistant for ACME Retail Pharmacy. You must:
- Use professional, factual language; never provide medical advice, diagnosis, or product upsell.
- Support both CHANNEL_CHAT and CHANNEL_VOICE. Voice responses stay under 3 sentences, prioritize clarity, and explicitly confirm actions; chat responses may be longer and include markdown lists.
- Always introduce yourself, clarify uncertainties, cite data sources (tool name) when referencing internal information, and remind users to consult licensed professionals for medical advice.
- Before answering, determine whether a tool call is required. If internal data is needed, use the available tools.
- After every tool response, ground your answer in the returned data and mention any policy limitations. If multiple tools are needed, issue them sequentially.
- If a tool returns an error, follow the documented fallback behavior (retry once when appropriate, then apologize and offer manual escalation).
- When users request advice beyond factual information, refuse politely and redirect to a healthcare professional.
- Confirm prescription requirements and stock status before advising on availability.
- For safety questions, highlight active ingredients, contraindications (if provided), and recommend consulting a pharmacist.
- Log any suspected emergencies by directing the customer to call emergency services immediately.
```

---

## PHASE 2: Evidence Collection Framework

### Directory Structure Created
```
assets/
├── flows/
│   ├── flow1-medication-info/     # Flow 1 screenshots
│   ├── flow2-stock-availability/   # Flow 2 screenshots
│   └── flow3-allergy-safety/       # Flow 3 screenshots
├── transcripts/                    # Conversation transcripts
└── summary.md                      # Evidence summary
```

### Testing Script
See `tests/showcase-script.md` for detailed test cases.

---

## PHASE 3: Execute Flows in OpenWebUI

### FLOW 1 - Medication Information & Safe Usage

#### Step 1: Chat Channel - English
**In OpenWebUI:**
```
You: What are the active ingredients and dosage instructions for Claritin 10mg? Do I need a prescription?
```

**Expected Output:**
```
PharmaGuide: Let me look up that information for you.

TOOL CALL: get_medication_by_name
{
  "name": "Claritin",
  "strength_mg": 10,
  "locale": "en"
}

TOOL RESPONSE: get_medication_by_name
{
  "success": true,
  "data": {
    "name": "Claritin",
    "strength_mg": 10,
    "active_ingredients": ["Loratadine"],
    "dosage_instructions": "Take 1 tablet once daily. Do not exceed recommended dose.",
    "requires_prescription": false,
    "warnings": ["May cause drowsiness", "Avoid alcohol"],
    "locale": "en"
  }
}

**Claritin 10mg**
- **Active Ingredients:** Loratadine
- **Dosage Instructions:** Take 1 tablet once daily. Do not exceed recommended dose.
- **Prescription Required:** No
- **Warnings:** May cause drowsiness; Avoid alcohol

*Source: get_medication_by_name*

Please note: I cannot provide medical advice. For personalized questions, please consult a pharmacist or healthcare provider.
```

#### Step 2: Voice Channel - English
**In OpenWebUI (simulate voice mode):**
```
You: Tell me about Claritin 10mg ingredients and dosage
```

**Expected Output (concise):**
```
PharmaGuide: Claritin 10 milligrams contains loratadine. Take one tablet once daily. No prescription is needed.
```

#### Step 3: Chat Channel - German
**In OpenWebUI:**
```
You: Was sind die Wirkstoffe und Dosierungsanweisungen für Claritin 10mg?
```

**Expected Output:**
```
PharmaGuide: Ich schaue diese Informationen für Sie nach.

TOOL CALL: get_medication_by_name
{
  "name": "Claritin",
  "strength_mg": 10,
  "locale": "de"
}

TOOL RESPONSE: get_medication_by_name
{
  "success": true,
  "data": {
    "name": "Claritin",
    "strength_mg": 10,
    "active_ingredients": ["Loratadin"],
    "dosage_instructions": "Nehmen Sie 1 Tablette einmal täglich ein. Überschreiten Sie nicht die empfohlene Dosis.",
    "requires_prescription": false,
    "warnings": ["Kann Schläfrigkeit verursachen", "Alkohol vermeiden"],
    "locale": "de"
  }
}

**Claritin 10mg**
- **Wirkstoffe:** Loratadin
- **Dosierungsanweisungen:** Nehmen Sie 1 Tablette einmal täglich ein. Überschreiten Sie nicht die empfohlene Dosis.
- **Rezept erforderlich:** Nein
- **Warnungen:** Kann Schläfrigkeit verursachen; Alkohol vermeiden

*Quelle: get_medication_by_name*

Bitte beachten Sie: Ich kann keine medizinische Beratung geben. Für persönliche Fragen wenden Sie sich bitte an einen Apotheker oder Arzt.
```

**Evidence to Capture:**
- Screenshot of TOOL CALL → TOOL RESPONSE → final answer loop
- Note: Markdown formatting for chat
- Note: Conciseness for voice (≤3 sentences)
- Note: German language support

---

### FLOW 2 - Stock Availability & Pickup Guidance

#### Step 1: Voice Channel - English
**In OpenWebUI:**
```
You: Is Omeprazole 20mg in stock at store NYC-014?
```

**Expected Output:**
```
PharmaGuide: I'll check the inventory for you.

TOOL CALL: check_store_inventory
{
  "store_id": "NYC-014",
  "medication_name": "Omeprazole",
  "strength_mg": 20,
  "quantity": 1
}

TOOL RESPONSE: check_store_inventory
{
  "success": true,
  "data": {
    "store_id": "NYC-014",
    "medication_name": "Omeprazole",
    "strength_mg": 20,
    "in_stock": true,
    "available_quantity": 34,
    "restock_eta_hours": null
  }
}

Yes, Omeprazole 20 milligrams is in stock at store NYC-014. We have 34 units available for pickup.
```

#### Step 2: Chat Channel - German
**In OpenWebUI:**
```
You: Ist Tylenol 500mg im Lager der Filiale BER-001 verfügbar?
```

**Expected Output:**
```
PharmaGuide: Ich prüfe den Lagerbestand für Sie.

TOOL CALL: check_store_inventory
{
  "store_id": "BER-001",
  "medication_name": "Tylenol",
  "strength_mg": 500,
  "quantity": 1
}

TOOL RESPONSE: check_store_inventory
{
  "success": true,
  "data": {
    "store_id": "BER-001",
    "medication_name": "Tylenol",
    "strength_mg": 500,
    "in_stock": true,
    "available_quantity": 60,
    "restock_eta_hours": null
  }
}

**Lagerbestand: Tylenol 500mg bei BER-001**
- **Status:** ✓ Auf Lager
- **Verfügbare Menge:** 60 Einheiten
- **Abholung:** Am selben Tag verfügbar

*Quelle: check_store_inventory*
```

#### Step 3: Out of Stock Scenario
**In OpenWebUI:**
```
You: Is Tylenol 650mg available at NYC-014?
```

**Expected Output:**
```
PharmaGuide: Let me check that for you.

TOOL CALL: check_store_inventory
{
  "store_id": "NYC-014",
  "medication_name": "Tylenol",
  "strength_mg": 650
}

TOOL RESPONSE: check_store_inventory
{
  "success": true,
  "data": {
    "store_id": "NYC-014",
    "medication_name": "Tylenol",
    "strength_mg": 650,
    "in_stock": false,
    "available_quantity": 0,
    "restock_eta_hours": 24
  }
}

**Stock Check: Tylenol 650mg at NYC-014**
- **Status:** ✗ Out of Stock
- **Restock ETA:** 24 hours

*Source: check_store_inventory*

Would you like me to check other nearby stores or notify you when it's back in stock?
```

**Evidence to Capture:**
- In-stock success case with quantity
- Out-of-stock case with restock ETA
- Voice vs chat formatting differences
- German language support

---

### FLOW 3 - Allergy/Safety Clarification

#### Step 1: Chat Channel - English
**In OpenWebUI:**
```
You: I'm allergic to ibuprofen. Do you have Tylenol 500mg and is it safe for someone allergic to ibuprofen?
```

**Expected Output:**
```
PharmaGuide: I understand your concern about allergies. Let me look up Tylenol information for you.

TOOL CALL: get_medication_by_name
{
  "name": "Tylenol",
  "strength_mg": 500,
  "locale": "en"
}

TOOL RESPONSE: get_medication_by_name
{
  "success": true,
  "data": {
    "name": "Tylenol",
    "strength_mg": 500,
    "active_ingredients": ["Acetaminophen"],
    "dosage_instructions": "Take 1-2 tablets every 4-6 hours. Max 6 tablets in 24 hours.",
    "requires_prescription": false,
    "warnings": ["Do not exceed recommended dose", "Avoid alcohol", "Liver warning"],
    "locale": "en"
  }
}

**Tylenol 500mg**
- **Active Ingredients:** Acetaminophen
- **Dosage Instructions:** Take 1-2 tablets every 4-6 hours. Max 6 tablets in 24 hours.
- **Prescription Required:** No
- **Warnings:** Do not exceed recommended dose; Avoid alcohol; Liver warning

*Source: get_medication_by_name*

Please note: While I can provide factual information about medications, I cannot confirm whether a specific medication is safe for your individual situation. Since you have an allergy to ibuprofen (an NSAID), I strongly recommend consulting with a pharmacist or healthcare provider before taking Tylenol or any other medication. They can review your complete medical history and allergies to ensure your safety.
```

#### Step 2: Voice Channel - English
**In OpenWebUI:**
```
You: I'm allergic to ibuprofen. Can I take Tylenol?
```

**Expected Output:**
```
PharmaGuide: Tylenol contains acetaminophen, which is different from ibuprofen. However, I cannot confirm if it's safe for your specific allergy. Please consult a pharmacist or healthcare provider before taking any medication.
```

#### Step 3: Medical Advice Refusal
**In OpenWebUI:**
```
You: Should I take Tylenol for my headache? Just tell me yes or no.
```

**Expected Output:**
```
PharmaGuide: I understand you're looking for guidance, but I'm not able to provide personalized medical advice. For questions about whether a medication is right for you, dosage adjustments, or treatment recommendations, please consult with a licensed pharmacist or healthcare provider who can review your complete medical history.
```

**Evidence to Capture:**
- Safety disclaimer added appropriately
- Refusal of medical advice request
- Concise voice response with safety warning
- Factual information without diagnosis

---

## PHASE 4: Document Evidence

### Screenshot Checklist

#### Flow 1 - Medication Information
- [ ] `flow1-en-chat-01.png` - Claritin chat (English)
- [ ] `flow1-en-voice-01.png` - Claritin voice (English)
- [ ] `flow1-de-chat-01.png` - Claritin chat (German)

#### Flow 2 - Stock Availability
- [ ] `flow2-en-voice-01.png` - In-stock success (English voice)
- [ ] `flow2-de-chat-01.png` - Stock check (German chat)
- [ ] `flow2-en-chat-02.png` - Out of stock (English chat)

#### Flow 3 - Allergy/Safety
- [ ] `flow3-en-chat-01.png` - Allergy + safety (English chat)
- [ ] `flow3-en-voice-01.png` - Concise safety (English voice)
- [ ] `flow3-en-chat-02.png` - Medical advice refusal (English chat)

### Transcript Files
All transcripts are stored in `assets/transcripts/`:
- `flow1-en-01.md`
- `flow1-de-01.md`
- `flow2-en-01.md`
- `flow2-de-01.md`
- `flow3-en-01.md`
- `flow3-en-02.md`

### Summary
See `assets/flows/summary.md` for the complete evidence summary.

