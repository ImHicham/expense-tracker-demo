import { BINDINGS } from "../../common/constants";
import Operation from "../../common/operation";
import { inject, injectable, z } from "../../common/types";
import useTransaction from "../../common/useTransaction";
import logger from "../../infra/loaders/logger";
import { ExpenseSheet } from "./types";

@useTransaction()
@injectable()
class RemoveExpenseSheet extends Operation {
  static validationRules = z.object({
    userId: z.string().uuid().min(1), // Validates as a required UUID string
    expenseSheetId: z.string().uuid().min(1), // Validates as a required UUID string
  });

  @inject(BINDINGS.ExpenseSheetsRepository)
  private _expenseSheetsRepository: any;

  async execute(
    this: RemoveExpenseSheet,
    validatedUserData: any
  ): Promise<ExpenseSheet[]> {
    const { expenseSheetId } = validatedUserData;

    try {
      logger.info(`RemoveExpenseSheet:expenseSheetId=${expenseSheetId}`);

      return this._expenseSheetsRepository.removeExpenseSheet(expenseSheetId);
    } catch (error) {
      logger.error(
        `RemoveExpenseSheet:error:${(error as Error).name}:${
          (error as Error).message
        }`
      );
      throw error;
    }
  }
}

export default RemoveExpenseSheet;
