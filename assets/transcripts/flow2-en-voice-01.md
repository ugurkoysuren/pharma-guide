# Flow 2 - Stock Availability & Pickup Guidance (English Voice)

## Test Case: Multi-Step Stock Check (Voice Channel)

**Channel:** Voice  
**Locale:** English (en)  
**Date:** [To be filled]

---

## Step 1: Initial Stock Query (Missing Store)

### User Message:
```
Is Omeprazole 20mg in stock?
```

### Agent Response:
```
I need to know which store location. We have NYC-014 in Midtown, NYC-015 Downtown, or BER-001 in Berlin.
```

---

## Step 2: User Provides Store Location

### User Message:
```
NYC-014
```

### Agent Response:
```
I'm checking the inventory now.
```

### TOOL CALL:
```json
{
  "name": "check_store_inventory",
  "payload": {
    "store_id": "NYC-014",
    "medication_name": "Omeprazole",
    "strength_mg": 20,
    "quantity": 1
  }
}
```

### TOOL RESPONSE:
```json
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
```

### Agent Response:
```
Yes, Omeprazole 20 milligrams is in stock at store NYC-014. We have 34 units available for pickup.
```

---

## Step 3: Follow-up Prescription Question

### User Message:
```
Do I need a prescription?
```

### Agent Response:
```
Let me check that for you.
```

### TOOL CALL:
```json
{
  "name": "verify_prescription_requirement",
  "payload": {
    "medication_name": "Omeprazole",
    "strength_mg": 20
  }
}
```

### TOOL RESPONSE:
```json
{
  "success": true,
  "data": {
    "medication_name": "Omeprazole",
    "strength_mg": 20,
    "requires_prescription": true,
    "prescriber_types": ["Physician", "Nurse Practitioner"],
    "notes": "Valid prescription must be less than 6 months old"
  }
}
```

### Final Agent Response:
```
Yes, Omeprazole 20 milligrams requires a prescription from a physician or nurse practitioner. Bring your prescription when you pick it up at NYC-014.
```

### Verdict:
✅ Multi-step flow with 3 interactions  
✅ Agent asks for missing information  
✅ Concise responses (≤3 sentences each)  
✅ Voice channel formatting  
✅ Tool called correctly in sequence  
✅ Complete information provided

