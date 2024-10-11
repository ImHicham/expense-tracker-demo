import { inject, injectable, toCamelCase, z } from "../../common/types";

import Operation from "../../common/operation";
import logger from "../../infra/loaders/logger";

import { BINDINGS } from "../../common/constants";
import { Expense } from "../expense/types";

@injectable()
class GetUserSheetExpenses extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // Validates as a required UUID string
    expenseSheetId: z.string().uuid().min(1), // Validates as a required UUID string
    expand: z.string().optional(),
  });

  @inject(BINDINGS.ExpensesRepository)
  private _expenseRepository: any;

  async execute(
    this: GetUserSheetExpenses,
    validatedUserData: any
  ): Promise<Expense[]> {
    const {
      expenseSheetId,
      pageSize = 100,
      pageInd = 0,
      search = "",
      expand,
    } = validatedUserData;
    try {
      logger.info(
        `GetUserExpenseSheets:execute expenseSheetId=${expenseSheetId}:${expand}`
      );

      const expenses =
        (await this._expenseRepository.findExpensesBySheetId(
          expenseSheetId,
          pageInd,
          pageSize,
          search,
          expand
        )) || [];

      return expenses.map((t) => toCamelCase(t));
    } catch (error) {
      logger.error("GetUserSheetExpenses:error", error);
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

export default GetUserSheetExpenses;
