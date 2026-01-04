import { ToolName, ToolCall, ToolResult } from '../types';
import { getMedicationByName } from './get-medication-by-name';
import { checkStoreInventory } from './check-store-inventory';
import { verifyPrescriptionRequirement } from './verify-prescription-requirement';

export { getMedicationByName } from './get-medication-by-name';
export { checkStoreInventory } from './check-store-inventory';
export { verifyPrescriptionRequirement } from './verify-prescription-requirement';

export type ToolHandler = (input: Record<string, unknown>) => ToolResult<unknown>;
const toolRegistry: Record<ToolName, ToolHandler> = {
  get_medication_by_name: (input) => getMedicationByName(input as never),
  check_store_inventory: (input) => checkStoreInventory(input as never),
  verify_prescription_requirement: (input) => verifyPrescriptionRequirement(input as never),
};

export function executeTool(call: ToolCall): ToolResult<unknown> {
  const handler = toolRegistry[call.name];
  if (!handler) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT' as never,
        message: `Unknown tool: ${call.name}`,
        retryable: false,
      },
    };
  }
  return handler(call.payload);
}

export function getAvailableTools(): ToolName[] {
  return Object.keys(toolRegistry) as ToolName[];
}
