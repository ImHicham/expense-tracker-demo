import { inject, injectable, toCamelCase, z } from "../../common/types";

import Operation from "../../common/operation";
import logger from "../../infra/loaders/logger";

import { BINDINGS } from "../../common/constants";
import { ExpenseSheet } from "./types";

@injectable()
class GetUserExpenseSheet extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // Validates as a required UUID string
    expenseSheetId: z.string().uuid().min(1), // Validates as a required UUID string
  });

  @inject(BINDINGS.ExpenseSheetsRepository)
  private _expenseSheetsRepository: any;

  async execute(
    this: GetUserExpenseSheet,
    validatedUserData: any
  ): Promise<ExpenseSheet> {
    const {
      expenseSheetId,
      pageSize = 1,
      pageInd = 0,
      search = "",
    } = validatedUserData;
    try {
      logger.info(
        `GetUserExpenseSheets:execute expenseSheetId=${expenseSheetId}`
      );

      const expenseSheets =
        (await this._expenseSheetsRepository.findExpenseSheetById(
          expenseSheetId,
          pageInd,
          pageSize,
          search
        )) || [];

      return expenseSheets.map((t) => toCamelCase(t))[0];
    } catch (error) {
      logger.error("GetUserExpenseSheets:error", error);
      if (typeof error === "string") {
        throw new Error(error);
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
}

export default GetUserExpenseSheet;
