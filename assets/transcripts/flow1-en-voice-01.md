# Flow 1 - Medication Information & Safe Usage (English Voice)

## Test Case: Multi-Step Medication Query (Voice Channel)

**Channel:** Voice  
**Locale:** English (en)  
**Date:** [To be filled]

---

## Step 1: Initial Medication Query

### User Message:
```
Tell me about Claritin 10mg ingredients and dosage.
```

### Agent Response:
```
I'm checking that information for you now.
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
Claritin 10 milligrams contains loratadine. Take one tablet once daily. No prescription is needed.
```

---

## Step 2: Follow-up Prescription Question

### User Message:
```
Do I need a prescription?
```

### Agent Response:
```
Let me verify that for you.
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
No prescription is required. Claritin 10 milligrams is available over the counter. Please consult a pharmacist if you have questions about this medication.
```

### Verdict:
✅ Multi-step flow with 2 tool calls  
✅ Concise responses (≤3 sentences each)  
✅ Voice channel formatting  
✅ Tool called correctly in sequence  
✅ Prescription status confirmed

