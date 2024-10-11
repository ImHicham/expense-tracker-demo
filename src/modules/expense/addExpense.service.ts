import { inject, injectable, z } from "../../common/types";

import Operation from "../../common/operation";
import logger from "../../infra/loaders/logger";

import { BINDINGS } from "../../common/constants";
import { Expense } from "./types";
import useTransaction from "../../common/useTransaction";

@useTransaction()
@injectable()
class AddExpense extends Operation {
  static validationRules = z.object({
    expense: z.object({
      name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(200, { message: "Name must not exceed 200 characters" }), // Required name field with length constraints
      amount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, {
          message: "Amount must be a valid decimal number (e.g., 200.50)",
        }) // Valid decimal format
        .refine((value) => parseFloat(value) > 0, {
          message: "Amount must be a positive number",
        }), // Must be positive
      expected: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, {
          message: "Expected must be a valid decimal number (e.g., 150.00)",
        }) // Valid decimal format
        .refine((value) => parseFloat(value) > 0, {
          message: "Expected amount must be a positive number",
        }) // Optional and must be positive
        .optional(), // Expected amount is optional
      category_id: z
        .string()
        .uuid({ message: "Category ID must be a valid UUID" }), // Foreign key to Category table
      sheet_id: z.string().uuid({ message: "Sheet ID must be a valid UUID" }), // Foreign key to Sheet table
    }),
  });

  @inject(BINDINGS.ExpensesRepository)
  private _expensesRepository: any;

  async execute(this: AddExpense, validatedUserData: any): Promise<Expense> {
    const { expense } = validatedUserData;

    try {
      logger.info(`AddExpenses:execute:expenses=${JSON.stringify(expense)}`);

      return this._expensesRepository.addExpense(expense);
    } catch (error) {
      logger.error(
        `AddExpenses:error:${(error as Error).name}:${(error as Error).message}`
      );
      throw error;
    }
  }
}

export default AddExpense;
