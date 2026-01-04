import { verifyPrescriptionRequirement } from '../../src/tools/verify-prescription-requirement';
import { MedicationForm, ToolErrorCode } from '../../src/types';

describe('verify_prescription_requirement', () => {
  describe('OTC medications', () => {
    it('should return no prescription required for Tylenol', () => {
      const result = verifyPrescriptionRequirement({ medication_name: 'Tylenol' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.medication_name).toBe('Tylenol');
        expect(result.data.requires_prescription).toBe(false);
        expect(result.data.prescriber_types).toHaveLength(0);
      }
    });

    it('should return no prescription required for Claritin', () => {
      const result = verifyPrescriptionRequirement({ medication_name: 'Claritin' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requires_prescription).toBe(false);
      }
    });

    it('should include OTC notes', () => {
      const result = verifyPrescriptionRequirement({ medication_name: 'Omeprazole' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.notes).toContain('OTC');
      }
    });
  });

  describe('prescription medications', () => {
    it('should return prescription required for Amoxicillin', () => {
      const result = verifyPrescriptionRequirement({ medication_name: 'Amoxicillin' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requires_prescription).toBe(true);
        expect(result.data.prescriber_types).toContain('Physician');
        expect(result.data.notes).toContain('prescription');
      }
    });

    it('should return prescription required for Lisinopril', () => {
      const result = verifyPrescriptionRequirement({
        medication_name: 'Lisinopril',
        strength_mg: 10,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.requires_prescription).toBe(true);
        expect(result.data.strength_mg).toBe(10);
      }
    });

    it('should list acceptable prescriber types for Metformin', () => {
      const result = verifyPrescriptionRequirement({ medication_name: 'Metformin' });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.prescriber_types).toContain('Physician');
        expect(result.data.prescriber_types).toContain('Endocrinologist');
      }
    });
  });

  describe('form validation', () => {
    it('should accept valid form for medication', () => {
      const result = verifyPrescriptionRequirement({
        medication_name: 'Tylenol',
        form: MedicationForm.TABLET,
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid form for medication', () => {
      const result = verifyPrescriptionRequirement({
        medication_name: 'Claritin',
        form: MedicationForm.SYRUP, // Claritin only comes in tablet
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ToolErrorCode.NOT_SUPPORTED);
        expect(result.error.message).toContain('not available in syrup form');
      }
    });
  });

  describe('error handling', () => {
    it('should return NOT_SUPPORTED for unknown medication', () => {
      const result = verifyPrescriptionRequirement({ medication_name: 'UnknownDrug' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ToolErrorCode.NOT_SUPPORTED);
        expect(result.error.message).toContain('not available');
      }
    });

    it('should return INVALID_INPUT for empty medication name', () => {
      const result = verifyPrescriptionRequirement({ medication_name: '' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(ToolErrorCode.INVALID_INPUT);
      }
    });
  });
});
