import createController from "../../common/createController";
import { Request } from "../../common/types";

import GetAllcategories from "./getCategory.service";
import Addcategory from "./addCategory.service";

export default {
  getAllcategories: createController(GetAllcategories, (req: Request) => ({
    search: req.query.search,
    pageSize: req.query.pageSize,
    pageInd: req.query.pageInd,
  })),
  addcategories: createController(Addcategory, (req: Request) => ({
    category: req.body.category,
  })),
};
