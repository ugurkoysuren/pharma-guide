import {
  GetMedicationByNameInput,
  GetMedicationByNameOutput,
  ToolResult,
  ToolErrorCode,
  Locale,
} from '../types';
import { findMedication } from '../mocks';

export function getMedicationByName(
  input: GetMedicationByNameInput
): ToolResult<GetMedicationByNameOutput> {
  // Validate input
  if (!input.name || input.name.trim().length === 0) {
    return {
      success: false,
      error: {
        code: ToolErrorCode.INVALID_INPUT,
        message: 'Medication name is required',
        retryable: false,
      },
    };
  }

  const locale = input.locale || Locale.EN;
  const medication = findMedication(input.name);

  if (!medication) {
    return {
      success: false,
      error: {
        code: ToolErrorCode.NOT_FOUND,
        message: `Medication "${input.name}" not found in our database`,
        retryable: false,
      },
    };
  }

  // Determine strength to use
  let strengthMg = input.strength_mg;
  if (!strengthMg) {
    // Default to first available strength
    strengthMg = medication.strengths[0];
  } else if (!medication.strengths.includes(strengthMg)) {
    return {
      success: false,
      error: {
        code: ToolErrorCode.NOT_FOUND,
        message: `${medication.name} is not available in ${strengthMg}mg. Available strengths: ${medication.strengths.join(', ')}mg`,
        retryable: false,
      },
    };
  }

  // Get localized data
  const isGerman = locale === Locale.DE;
  const name = isGerman && medication.name_de ? medication.name_de : medication.name;
  const activeIngredients =
    isGerman && medication.active_ingredients_de
      ? medication.active_ingredients_de
      : medication.active_ingredients;
  const dosageInstructions =
    isGerman && medication.dosage_instructions_de
      ? medication.dosage_instructions_de[strengthMg] || medication.dosage_instructions[strengthMg]
      : medication.dosage_instructions[strengthMg];
  const warnings =
    isGerman && medication.warnings_de ? medication.warnings_de : medication.warnings;

  return {
    success: true,
    data: {
      name,
      strength_mg: strengthMg,
      active_ingredients: activeIngredients,
      dosage_instructions: dosageInstructions,
      requires_prescription: medication.requires_prescription,
      warnings,
      locale,
    },
  };
}
