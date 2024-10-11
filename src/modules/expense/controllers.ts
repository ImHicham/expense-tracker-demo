import createController from "../../common/createController";
import { Request } from "../../common/types";

import AddExpense from "./addExpense.service";
import RemoveExpense from "./removeExpense.service";

export default {
  addExpenses: createController(AddExpense, (req: Request) => ({
    expense: req.body.expense,
  })),
  removeExpense: createController(RemoveExpense, (req: Request) => ({
    expenseId: req.params.id,
  })),
};
