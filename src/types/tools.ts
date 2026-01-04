import { Locale } from './channels';

// Error types
export enum ToolErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  SERVER_ERROR = 'SERVER_ERROR',
  OUTAGE = 'OUTAGE',
  TIMEOUT = 'TIMEOUT',
  NOT_SUPPORTED = 'NOT_SUPPORTED',
}

export interface ToolError {
  code: ToolErrorCode;
  message: string;
  retryable: boolean;
}

export type ToolResult<T> = { success: true; data: T } | { success: false; error: ToolError };

// Medication form types
export enum MedicationForm {
  TABLET = 'tablet',
  CAPSULE = 'capsule',
  SYRUP = 'syrup',
  OINTMENT = 'ointment',
  OTHER = 'other',
}

// get_medication_by_name
export interface GetMedicationByNameInput {
  name: string;
  strength_mg?: number;
  locale?: Locale;
}

export interface GetMedicationByNameOutput {
  name: string;
  strength_mg: number;
  active_ingredients: string[];
  dosage_instructions: string;
  requires_prescription: boolean;
  warnings: string[];
  locale: Locale;
}

// check_store_inventory
export interface CheckStoreInventoryInput {
  store_id: string;
  medication_name: string;
  strength_mg?: number;
  quantity?: number;
}

export interface CheckStoreInventoryOutput {
  store_id: string;
  medication_name: string;
  strength_mg: number | null;
  in_stock: boolean;
  available_quantity: number;
  restock_eta_hours: number | null;
}

// verify_prescription_requirement
export interface VerifyPrescriptionRequirementInput {
  medication_name: string;
  strength_mg?: number;
  form?: MedicationForm;
}

export interface VerifyPrescriptionRequirementOutput {
  medication_name: string;
  strength_mg: number | null;
  requires_prescription: boolean;
  prescriber_types: string[];
  notes: string;
}

// Tool registry types
export type ToolName =
  | 'get_medication_by_name'
  | 'check_store_inventory'
  | 'verify_prescription_requirement';

export interface ToolCall {
  name: ToolName;
  payload: Record<string, unknown>;
}

export interface ToolResponse {
  name: ToolName;
  result: ToolResult<unknown>;
}
