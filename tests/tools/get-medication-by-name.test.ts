import { getMedicationByName } from '../../src/tools/get-medication-by-name';
import { Locale, ToolErrorCode } from '../../src/types';

describe('get_medication_by_name', () => {
  describe('successful queries', () => {
    it('should return medication info for Claritin 10mg', () => {
      const result = getMedicationByName({ name: 'Claritin', strength_mg: 10 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Claritin');
        expect(result.data.strength_mg).toBe(10);
        expect(result.data.active_ingredients).toContain('Loratadine');
        expect(result.data.requires_prescription).toBe(false);
        expect(result.data.locale).toBe(Locale.EN);
      }
    });

    it('should return medication info with default strength if not specified', () => {
      const result = getMedicationByName({ name: 'Tylenol' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Tylenol');
        expect(result.data.strength_mg).toBe(325); // First available strength
      }
    });

    it('should return German info when locale is de', () => {
      const result = getMedicationByName({ name: 'Claritin', strength_mg: 10, locale: Locale.DE });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('Claritin');
        expect(result.data.active_ingredients).toContain('Loratadin');
        expect(result.data.locale).toBe(Locale.DE);
      }
    });

    it('should return prescription-required medication info', () => {
      const result = getMedicationByName({ name: 'Amoxicillin', strength_mg: 500 });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requires_prescription).toBe(true);
      }
    });
  });

  describe('error handling', () => {
    it('should return NOT_FOUND for unknown medication', () => {
      const result = getMedicationByName({ name: 'UnknownMed' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ToolErrorCode.NOT_FOUND);
      }
    });

    it('should return NOT_FOUND for unavailable strength', () => {
      const result = getMedicationByName({ name: 'Claritin', strength_mg: 50 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ToolErrorCode.NOT_FOUND);
        expect(result.error.message).toContain('not available in 50mg');
      }
    });

    it('should return INVALID_INPUT for empty name', () => {
      const result = getMedicationByName({ name: '' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ToolErrorCode.INVALID_INPUT);
      }
    });

    it('should handle case-insensitive medication names', () => {
      const result = getMedicationByName({ name: 'TYLENOL' });

      expect(result.success).toBe(true);
    });
  });
});
