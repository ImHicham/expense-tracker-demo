import createController from "../../common/createController";
import { Request, Response, toCamelCase } from "../../common/types";

import GetAllExpenseSheets from "./getExpenseSheets.service";
import GetUserExpenseSheets from "./getUserExpenseSheets.service";
import GetUserExpenseSheet from "./getUserExpenseSheet.service";
import GetUserSheetExpenses from "./getUserSheetExpenses.service";
import AddExpenseSheets from "./addExpenseSheet.service";
import RemoveExpenseSheet from "./removeExpenseSheets.service";

export default {
  getAllExpenseSheets: createController(
    GetAllExpenseSheets,
    (req: Request) => ({
      search: req.query.search,
      pageSize: req.query.pageSize,
      pageInd: req.query.pageInd,
    }),
    (
      res: Response,
      {
        result,
        code,
        headers = [],
      }: { result: any; code: number; headers?: any[] }
    ) => {
      headers.forEach(({ name, value }) => {
        res.set(name, value);
      });

      result = result.map((t) => toCamelCase(t));
      return res.status(code).json({ result });
    }
  ),
  getUserExpenseSheets: createController(
    GetUserExpenseSheets,
    (req: Request) => ({
      userId: req["currentUser"].id,
      search: req.query.search,
      pageSize: req.query.pageSize,
      pageInd: req.query.pageInd,
    })
  ),
  getUserExpenseSheet: createController(
    GetUserExpenseSheet,
    (req: Request) => ({
      userId: req["currentUser"].id,
      expenseSheetId: req.params.id,
    })
  ),
  getUserSheetExpenses: createController(
    GetUserSheetExpenses,
    (req: Request) => ({
      userId: req["currentUser"].id,
      expenseSheetId: req.params.id,
      expand: req.query.expand,
    })
  ),
  addExpenseSheets: createController(AddExpenseSheets, (req: Request) => ({
    userId: req["currentUser"].id,
    expenseSheet: {
      ...req.body.expenseSheet,
      max_budget: req.body.expenseSheet.maxBudget,
    },
  })),
  removeExpenseSheet: createController(RemoveExpenseSheet, (req: Request) => ({
    userId: req["currentUser"].id,
    expenseSheetId: req.params.id,
  })),
};
