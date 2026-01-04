import {
  CheckStoreInventoryInput,
  CheckStoreInventoryOutput,
  ToolResult,
  ToolErrorCode,
} from '../types';
import { findStore, checkStock } from '../mocks';

export function checkStoreInventory(
  input: CheckStoreInventoryInput
): ToolResult<CheckStoreInventoryOutput> {
  // Validate required inputs
  if (!input.store_id || input.store_id.trim().length === 0) {
    return {
      success: false,
      error: {
        code: ToolErrorCode.INVALID_INPUT,
        message: 'Store ID is required',
        retryable: false,
      },
    };
  }

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

  // Find the store
  const store = findStore(input.store_id);
  if (!store) {
    return {
      success: false,
      error: {
        code: ToolErrorCode.NOT_FOUND,
        message: `Store "${input.store_id}" not found`,
        retryable: false,
      },
    };
  }

  // Check stock
  const stock = checkStock(input.store_id, input.medication_name, input.strength_mg);

  if (!stock) {
    return {
      success: false,
      error: {
        code: ToolErrorCode.NOT_FOUND,
        message: `${input.medication_name}${input.strength_mg ? ` ${input.strength_mg}mg` : ''} not found at store ${input.store_id}`,
        retryable: false,
      },
    };
  }

  const requestedQuantity = input.quantity || 1;
  const inStock = stock.quantity >= requestedQuantity;

  return {
    success: true,
    data: {
      store_id: input.store_id,
      medication_name: input.medication_name,
      strength_mg: stock.strength_mg,
      in_stock: inStock,
      available_quantity: stock.quantity,
      restock_eta_hours: stock.quantity === 0 ? stock.restock_eta_hours : null,
    },
  };
}
