# Flow 2 - Stock Availability & Pickup Guidance (English Chat)

## Test Case: Multi-Step Stock Check with Prescription Verification

**Channel:** Chat  
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
I'd be happy to check Omeprazole 20mg availability for you. Which store location would you like me to check?

- NYC-014 (New York Midtown)
- NYC-015 (New York Downtown)
- BER-001 (Berlin Mitte)
```

---

## Step 2: User Provides Store Location

### User Message:
```
NYC-014
```

### Agent Response:
```
I'm checking the inventory for store NYC-014.
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
**Stock Check: Omeprazole 20mg at NYC-014**

**Status:**

✓ In Stock

- Available quantity: 34 units
- Pickup: Available for same-day pickup

*Source: check_store_inventory*
```

---

## Step 3: Follow-up Prescription Question

### User Message:
```
Do I need a prescription to buy this?
```

### Agent Response:
```
Let me verify the prescription requirements for Omeprazole 20mg.
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
**Prescription Requirement: Omeprazole 20mg**

**Prescription Required:**

- Yes

**Accepted From:**

- Physician
- Nurse Practitioner

**Notes:**

- Valid prescription must be less than 6 months old

*Source: verify_prescription_requirement*

Please note: Omeprazole 20mg requires a valid prescription. You'll need to bring your prescription when picking up the medication at store NYC-014. If you have any questions, please consult with a pharmacist at the store.
```

### Verdict:
✅ Multi-step flow with 3 interactions  
✅ Agent asks for missing information (store location)  
✅ Tool called correctly in sequence  
✅ Stock status and quantity provided  
✅ Prescription requirement verified via separate tool  
✅ Complete guidance provided
