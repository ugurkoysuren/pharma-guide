import {
  VerifyPrescriptionRequirementInput,
  VerifyPrescriptionRequirementOutput,
  ToolResult,
  ToolErrorCode,
} from '../types';
import { findPrescriptionRequirement } from '../mocks';

export function verifyPrescriptionRequirement(
  input: VerifyPrescriptionRequirementInput
): ToolResult<VerifyPrescriptionRequirementOutput> {
  // Validate required input
  if (!input.medication_name || input.medication_name.trim().length === 0) {
    return {
      success: false,
      error: {
        code: ToolErrorCode.INVALID_INPUT,
        message: 'Medication name is required',
        retryable: false,
      },
    };
  }

  // Find prescription requirement
  const requirement = findPrescriptionRequirement(input.medication_name);

  if (!requirement) {
    return {
      success: false,
      error: {
        code: ToolErrorCode.NOT_SUPPORTED,
        message: `Prescription information for "${input.medication_name}" is not available. Please contact a pharmacist.`,
        retryable: false,
      },
    };
  }

  // Check if the requested form is supported (if provided)
  if (input.form && !requirement.forms.includes(input.form)) {
    return {
      success: false,
      error: {
        code: ToolErrorCode.NOT_SUPPORTED,
        message: `${requirement.medication_name} is not available in ${input.form} form. Available forms: ${requirement.forms.join(', ')}`,
        retryable: false,
      },
    };
  }

  return {
    success: true,
    data: {
      medication_name: requirement.medication_name,
      strength_mg: input.strength_mg || null,
      requires_prescription: requirement.requires_prescription,
      prescriber_types: requirement.prescriber_types,
      notes: requirement.notes,
    },
  };
}
