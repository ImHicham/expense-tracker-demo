import { BINDINGS } from "../../common/constants";
import Operation from "../../common/operation";
import { inject, injectable, z } from "../../common/types";
import useTransaction from "../../common/useTransaction";
import logger from "../../infra/loaders/logger";

@useTransaction()
@injectable()
class RemoveExpense extends Operation {
  static validationRules = z.object({
    expenseId: z.string().uuid().min(1), // Validates as a required UUID string
  });

  @inject(BINDINGS.ExpensesRepository)
  private _expensesRepository: any;

  async execute(this: RemoveExpense, validatedUserData: any): Promise<void> {
    const { expenseId } = validatedUserData;

    try {
      logger.info(`RemoveExpense:expenseId=${expenseId}`);

      return this._expensesRepository.removeExpense(expenseId);
    } catch (error) {
      logger.error(
        `RemoveExpense:error:${(error as Error).name}:${
          (error as Error).message
        }`
      );
      throw error;
    }
  }
}

export default RemoveExpense;
