# Flow 1 - Medication Information & Safe Usage (English Chat)

## Test Case: Multi-Step Medication Query with Prescription Verification

**Channel:** Chat  
**Locale:** English (en)  
**Date:** [To be filled]

---

## Step 1: Initial Medication Query

### User Message:
```
What are the active ingredients and dosage instructions for Claritin 10mg?
```

### Agent Response:
```
Let me look up that information for you.
```

### TOOL CALL:
```json
{
  "name": "get_medication_by_name",
  "payload": {
    "name": "Claritin",
    "strength_mg": 10,
    "locale": "en"
  }
}
```

### TOOL RESPONSE:
```json
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
```

### Agent Response:
```
**Claritin 10mg**

**Active Ingredient:**

- Loratadine (10mg)

**Dosage Instructions:**

- Take 1 tablet once daily. Do not exceed recommended dose.

**Warnings:**

- May cause drowsiness
- Avoid alcohol

*Source: get_medication_by_name*
```

---

## Step 2: Follow-up Prescription Question

### User Message:
```
Do I need a prescription for this?
```

### Agent Response:
```
Let me verify the prescription requirements for Claritin 10mg.
```

### TOOL CALL:
```json
{
  "name": "verify_prescription_requirement",
  "payload": {
    "medication_name": "Claritin",
    "strength_mg": 10
  }
}
```

### TOOL RESPONSE:
```json
{
  "success": true,
  "data": {
    "medication_name": "Claritin",
    "strength_mg": 10,
    "requires_prescription": false,
    "prescriber_types": [],
    "notes": "Available over-the-counter without prescription"
  }
}
```

### Final Agent Response:
```
**Prescription Status:**

- No prescription required ✅ (over-the-counter)

**Notes:**

- Available over-the-counter without prescription

*Source: verify_prescription_requirement*

Please note: This is general product information only. Always read the package label carefully and consult with a healthcare professional or pharmacist if you have questions about this medication, especially if you have medical conditions, take other medications, or experience any unusual effects.

---

This information is for educational purposes only. Always consult a healthcare professional before taking any medication.
```

### Verdict:
✅ Multi-step flow with 2 tool calls  
✅ Tool called correctly in sequence  
✅ Factual information provided  
✅ Prescription status confirmed via separate tool  
✅ Safety disclaimer included  
✅ Markdown formatting used (chat channel)
