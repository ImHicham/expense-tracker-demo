import { Router } from "express";

import expenseSheetsController from "./controllers";
import { MiddlewareFn, UserRoles } from "../../common/types";

const route = Router();

export default (
  app: Router,
  {
    isAuth,
    attachCurrentUser,
    checkRole,
  }: {
    isAuth: MiddlewareFn;
    attachCurrentUser: MiddlewareFn;
    checkRole: (roleBits: number, errorMsg?: string) => MiddlewareFn;
  }
) => {
  app.use("/sheet", route);

  route.get(
    "/",
    isAuth,
    attachCurrentUser,
    expenseSheetsController.getUserExpenseSheets
  );

  route.get(
    "/admin",
    isAuth,
    attachCurrentUser,
    checkRole(UserRoles.Admin),
    expenseSheetsController.getAllExpenseSheets
  );

  route.get(
    "/:id",
    isAuth,
    attachCurrentUser,
    expenseSheetsController.getUserExpenseSheet
  );

  route.get(
    "/:id/expenses",
    isAuth,
    attachCurrentUser,
    expenseSheetsController.getUserSheetExpenses
  );

  route.post(
    "/",
    isAuth,
    attachCurrentUser,
    expenseSheetsController.addExpenseSheets
  );
  route.delete(
    "/:id",
    isAuth,
    attachCurrentUser,
    expenseSheetsController.removeExpenseSheet
  );
};
