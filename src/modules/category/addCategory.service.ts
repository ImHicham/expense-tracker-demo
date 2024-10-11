import { inject, injectable, z } from "../../common/types";

import Operation from "../../common/operation";
import logger from "../../infra/loaders/logger";

import { BINDINGS } from "../../common/constants";
import { Category } from "./types";
import useTransaction from "../../common/useTransaction";

@useTransaction()
@injectable()
class Addcategory extends Operation {
  static validationRules = z.object({
    category: z.object({
      name: z.string().min(2).max(200),
    }),
  });

  @inject(BINDINGS.CategoriesRepository)
  private _categoriesRepository: any;

  async execute(this: Addcategory, validatedUserData: any): Promise<Category> {
    const { category } = validatedUserData;

    try {
      logger.info(
        `Addcategories:execute:categories=${JSON.stringify(category)}`
      );

      return this._categoriesRepository.addcategory(category);
    } catch (error) {
      logger.error(
        `Addcategories:error:${(error as Error).name}:${
          (error as Error).message
        }`
      );
      throw error;
    }
  }
}

export default Addcategory;
