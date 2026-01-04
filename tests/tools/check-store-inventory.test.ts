import { checkStoreInventory } from '../../src/tools/check-store-inventory';
import { ToolErrorCode } from '../../src/types';

describe('check_store_inventory', () => {
  describe('successful queries', () => {
    it('should return in-stock medication at NYC-014', () => {
      const result = checkStoreInventory({
        store_id: 'NYC-014',
        medication_name: 'Claritin',
        strength_mg: 10,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.store_id).toBe('NYC-014');
        expect(result.data.medication_name).toBe('Claritin');
        expect(result.data.in_stock).toBe(true);
        expect(result.data.available_quantity).toBeGreaterThan(0);
        expect(result.data.restock_eta_hours).toBeNull();
      }
    });

    it('should return out-of-stock with restock ETA', () => {
      const result = checkStoreInventory({
        store_id: 'NYC-014',
        medication_name: 'Tylenol',
        strength_mg: 650,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.in_stock).toBe(false);
        expect(result.data.available_quantity).toBe(0);
        expect(result.data.restock_eta_hours).toBe(24);
      }
    });

    it('should check quantity against requested amount', () => {
      const result = checkStoreInventory({
        store_id: 'NYC-014',
        medication_name: 'Claritin',
        strength_mg: 10,
        quantity: 1000, // More than available
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.in_stock).toBe(false); // Not enough stock
      }
    });

    it('should find medication at Berlin store', () => {
      const result = checkStoreInventory({
        store_id: 'BER-001',
        medication_name: 'Omeprazole',
        strength_mg: 20,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.store_id).toBe('BER-001');
        expect(result.data.in_stock).toBe(true);
      }
    });
  });

  describe('error handling', () => {
    it('should return NOT_FOUND for unknown store', () => {
      const result = checkStoreInventory({
        store_id: 'XXX-999',
        medication_name: 'Tylenol',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ToolErrorCode.NOT_FOUND);
        expect(result.error.message).toContain('Store');
      }
    });

    it('should return NOT_FOUND for medication not at store', () => {
      const result = checkStoreInventory({
        store_id: 'NYC-015',
        medication_name: 'Atorvastatin',
        strength_mg: 20,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ToolErrorCode.NOT_FOUND);
      }
    });

    it('should return INVALID_INPUT for empty store_id', () => {
      const result = checkStoreInventory({
        store_id: '',
        medication_name: 'Tylenol',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ToolErrorCode.INVALID_INPUT);
      }
    });

    it('should return INVALID_INPUT for empty medication_name', () => {
      const result = checkStoreInventory({
        store_id: 'NYC-014',
        medication_name: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ToolErrorCode.INVALID_INPUT);
      }
    });
  });
});
