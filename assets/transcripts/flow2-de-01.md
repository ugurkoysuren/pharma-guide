# Flow 2 - Stock Availability & Pickup Guidance (German Chat)

## Test Case: Multi-Step Stock Check (German)

**Channel:** Chat  
**Locale:** German (de)  
**Date:** [To be filled]

---

## Step 1: Initial Stock Query (Missing Store)

### User Message:
```
Ist Tylenol 500mg im Lager verfügbar?
```

### Agent Response:
```
Ich kann gerne die Verfügbarkeit von Tylenol 500mg für Sie prüfen. Welche Filiale soll ich überprüfen?

- NYC-014 (New York Midtown)
- NYC-015 (New York Downtown)
- BER-001 (Berlin Mitte)
```

---

## Step 2: User Provides Store Location

### User Message:
```
BER-001
```

### Agent Response:
```
Ich prüfe den Lagerbestand für Filiale BER-001.
```

### TOOL CALL:
```json
{
  "name": "check_store_inventory",
  "payload": {
    "store_id": "BER-001",
    "medication_name": "Tylenol",
    "strength_mg": 500,
    "quantity": 1
  }
}
```

### TOOL RESPONSE:
```json
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
```

### Agent Response:
```
**Lagerbestand: Tylenol 500mg bei BER-001**

**Status:**

✓ Auf Lager

- Verfügbare Menge: 60 Einheiten
- Abholung: Am selben Tag verfügbar

*Quelle: check_store_inventory*
```

---

## Step 3: Follow-up Prescription Question

### User Message:
```
Benötige ich ein Rezept?
```

### Agent Response:
```
Ich prüfe die Rezeptanforderungen für Tylenol 500mg.
```

### TOOL CALL:
```json
{
  "name": "verify_prescription_requirement",
  "payload": {
    "medication_name": "Tylenol",
    "strength_mg": 500
  }
}
```

### TOOL RESPONSE:
```json
{
  "success": true,
  "data": {
    "medication_name": "Tylenol",
    "strength_mg": 500,
    "requires_prescription": false,
    "prescriber_types": [],
    "notes": "Rezeptfrei erhältlich"
  }
}
```

### Final Agent Response:
```
**Rezeptanforderung: Tylenol 500mg**

**Rezept erforderlich:**

- Nein (rezeptfrei)

**Hinweise:**

- Rezeptfrei erhältlich

*Quelle: verify_prescription_requirement*

Tylenol 500mg ist rezeptfrei erhältlich. Sie können es direkt in der Filiale BER-001 abholen. Bei Fragen wenden Sie sich bitte an einen Apotheker.
```

### Verdict:
✅ Multi-step flow with 3 interactions  
✅ Agent asks for missing information (store location)  
✅ German language response  
✅ Tool called correctly in sequence  
✅ Stock status and quantity provided  
✅ Prescription requirement verified
