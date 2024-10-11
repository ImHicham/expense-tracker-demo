import { Router } from "express";

import expensesController from "./controllers";
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
  app.use("/expense", route);

  route.post("/", isAuth, attachCurrentUser, expensesController.addExpenses);
  route.delete(
    "/:id",
    isAuth,
    attachCurrentUser,
    expensesController.removeExpense
  );
};
