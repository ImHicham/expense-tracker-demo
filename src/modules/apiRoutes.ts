import { Router } from "express";
import { isAuth, attachCurrentUser, checkRole } from "../infra/middlewares";

import userRoutes from "./users/routes";
import expenses from "./expense/routes";
import expenseSheet from "./expense-sheet/routes";
import categories from "./category/routes";

// guaranteed to get dependencies
export default () => {
  const app = Router();

  userRoutes(app, { isAuth, attachCurrentUser, checkRole });
  expenses(app, { isAuth, attachCurrentUser, checkRole });
  expenseSheet(app, { isAuth, attachCurrentUser, checkRole });
  categories(app, { isAuth, attachCurrentUser, checkRole });

  return app;
};
