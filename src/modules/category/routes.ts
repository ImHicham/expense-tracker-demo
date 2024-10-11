import { Router } from "express";

import categoriesController from "./controllers";
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
  app.use("/category", route);

  route.get(
    "/",
    isAuth,
    attachCurrentUser,
    categoriesController.getAllcategories
  );

  route.post(
    "/",
    isAuth,
    attachCurrentUser,
    categoriesController.addcategories
  );
};
