import { inject, injectable, z } from "../../common/types";

import Operation from "../../common/operation";
import logger from "../../infra/loaders/logger";

import { BINDINGS } from "../../common/constants";
import { ExpenseSheet } from "./types";
import useTransaction from "../../common/useTransaction";

@useTransaction()
@injectable()
class AddExpenseSheets extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // UUID and required
    expenseSheet: z.object({
      name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(200, { message: "Name must not exceed 200 characters" }), // Required name field with length constraints
      description: z
        .string()
        .min(2, { message: "description must be at least 2 characters long" })
        .max(200, { message: "description must not exceed 200 characters" }),
      max_budget: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, {
          message: "Amount must be a valid decimal number (e.g., 200.50)",
        }) // Valid decimal format
        .refine((value) => parseFloat(value) > 0, {
          message: "Amount must be a positive number",
        }),
    }),
  });

  @inject(BINDINGS.ExpenseSheetsRepository)
  private _expenseSheetsRepository: any;

  async execute(
    this: AddExpenseSheets,
    validatedUserData: any
  ): Promise<ExpenseSheet> {
    const { userId, expenseSheet } = validatedUserData;

    try {
      logger.info(
        `AddExpenseSheets:execute:userId=${userId}:expenseSheets=${JSON.stringify(
          expenseSheet
        )}`
      );

      return this._expenseSheetsRepository.addExpenseSheet(userId, {
        user_id: userId,
        ...expenseSheet,
      });
    } catch (error) {
      logger.error(
        `AddExpenseSheets:error:${(error as Error).name}:${
          (error as Error).message
        }`
      );
      throw error;
    }
  }
}

export default AddExpenseSheets;
