export interface StoreInventory {
  store_id: string;
  store_name: string;
  address: string;
  medications: Record<string, MedicationStock>;
}

export interface MedicationStock {
  strength_mg: number;
  quantity: number;
  restock_eta_hours: number | null;
}

export const storeInventories: Record<string, StoreInventory> = {
  'NYC-014': {
    store_id: 'NYC-014',
    store_name: 'ACME Pharmacy - Manhattan Central',
    address: '123 Main St, New York, NY 10001',
    medications: {
      'claritin-10': { strength_mg: 10, quantity: 45, restock_eta_hours: null },
      'omeprazole-20': { strength_mg: 20, quantity: 34, restock_eta_hours: null },
      'omeprazole-40': { strength_mg: 40, quantity: 12, restock_eta_hours: null },
      'tylenol-325': { strength_mg: 325, quantity: 100, restock_eta_hours: null },
      'tylenol-500': { strength_mg: 500, quantity: 78, restock_eta_hours: null },
      'tylenol-650': { strength_mg: 650, quantity: 0, restock_eta_hours: 24 },
      'ibuprofen-200': { strength_mg: 200, quantity: 150, restock_eta_hours: null },
      'ibuprofen-400': { strength_mg: 400, quantity: 60, restock_eta_hours: null },
      'amoxicillin-500': { strength_mg: 500, quantity: 25, restock_eta_hours: null },
      'lisinopril-10': { strength_mg: 10, quantity: 40, restock_eta_hours: null },
      'lisinopril-20': { strength_mg: 20, quantity: 30, restock_eta_hours: null },
      'metformin-500': { strength_mg: 500, quantity: 55, restock_eta_hours: null },
      'metformin-1000': { strength_mg: 1000, quantity: 35, restock_eta_hours: null },
      'atorvastatin-20': { strength_mg: 20, quantity: 50, restock_eta_hours: null },
      'cetirizine-10': { strength_mg: 10, quantity: 80, restock_eta_hours: null },
      'diphenhydramine-25': { strength_mg: 25, quantity: 65, restock_eta_hours: null },
    },
  },
  'NYC-015': {
    store_id: 'NYC-015',
    store_name: 'ACME Pharmacy - Brooklyn Heights',
    address: '456 Atlantic Ave, Brooklyn, NY 11201',
    medications: {
      'claritin-10': { strength_mg: 10, quantity: 30, restock_eta_hours: null },
      'omeprazole-20': { strength_mg: 20, quantity: 0, restock_eta_hours: 48 },
      'omeprazole-40': { strength_mg: 40, quantity: 8, restock_eta_hours: null },
      'tylenol-325': { strength_mg: 325, quantity: 90, restock_eta_hours: null },
      'tylenol-500': { strength_mg: 500, quantity: 50, restock_eta_hours: null },
      'ibuprofen-200': { strength_mg: 200, quantity: 120, restock_eta_hours: null },
      'ibuprofen-400': { strength_mg: 400, quantity: 0, restock_eta_hours: 12 },
      'amoxicillin-500': { strength_mg: 500, quantity: 15, restock_eta_hours: null },
      'cetirizine-10': { strength_mg: 10, quantity: 60, restock_eta_hours: null },
    },
  },
  'NYC-016': {
    store_id: 'NYC-016',
    store_name: 'ACME Pharmacy - Queens Plaza',
    address: '789 Queens Blvd, Queens, NY 11101',
    medications: {
      'claritin-10': { strength_mg: 10, quantity: 20, restock_eta_hours: null },
      'omeprazole-20': { strength_mg: 20, quantity: 45, restock_eta_hours: null },
      'tylenol-500': { strength_mg: 500, quantity: 40, restock_eta_hours: null },
      'ibuprofen-200': { strength_mg: 200, quantity: 85, restock_eta_hours: null },
      'amoxicillin-250': { strength_mg: 250, quantity: 20, restock_eta_hours: null },
      'amoxicillin-500': { strength_mg: 500, quantity: 30, restock_eta_hours: null },
      'lisinopril-5': { strength_mg: 5, quantity: 25, restock_eta_hours: null },
      'lisinopril-10': { strength_mg: 10, quantity: 35, restock_eta_hours: null },
      'metformin-850': { strength_mg: 850, quantity: 40, restock_eta_hours: null },
      'atorvastatin-10': { strength_mg: 10, quantity: 45, restock_eta_hours: null },
      'atorvastatin-40': { strength_mg: 40, quantity: 25, restock_eta_hours: null },
    },
  },
  'BER-001': {
    store_id: 'BER-001',
    store_name: 'ACME Pharmacy - Berlin Mitte',
    address: 'Friedrichstraße 100, 10117 Berlin',
    medications: {
      'claritin-10': { strength_mg: 10, quantity: 35, restock_eta_hours: null },
      'omeprazole-20': { strength_mg: 20, quantity: 28, restock_eta_hours: null },
      'tylenol-500': { strength_mg: 500, quantity: 60, restock_eta_hours: null },
      'ibuprofen-400': { strength_mg: 400, quantity: 45, restock_eta_hours: null },
      'cetirizine-10': { strength_mg: 10, quantity: 50, restock_eta_hours: null },
    },
  },
};

export function findStore(storeId: string): StoreInventory | undefined {
  return storeInventories[storeId];
}

export function getStoreIds(): string[] {
  return Object.keys(storeInventories);
}

export function checkStock(
  storeId: string,
  medicationName: string,
  strengthMg?: number
): MedicationStock | undefined {
  const store = findStore(storeId);
  if (!store) return undefined;

  const normalizedName = medicationName.toLowerCase().trim();
  const key = strengthMg ? `${normalizedName}-${strengthMg}` : normalizedName;

  // Try exact match first
  if (store.medications[key]) {
    return store.medications[key];
  }

  // Try to find any matching medication
  for (const [medKey, stock] of Object.entries(store.medications)) {
    if (medKey.startsWith(normalizedName)) {
      if (!strengthMg || stock.strength_mg === strengthMg) {
        return stock;
      }
    }
  }

  return undefined;
}
