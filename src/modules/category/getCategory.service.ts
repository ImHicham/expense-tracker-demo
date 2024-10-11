import { inject, injectable, z } from "../../common/types";

import Operation from "../../common/operation";
import logger from "../../infra/loaders/logger";

import { BINDINGS } from "../../common/constants";
import { Category } from "./types";

@injectable()
class Getcategories extends Operation {
  static validationRules = z.object({
    search: z
      .string()
      .max(50)
      .optional()
      .or(z.literal("").or(z.null()))
      .refine((val) => /^[a-zA-Z0-9]*$/.test(val || ""), {
        message: "Must be alphanumeric",
      }), // Allows empty string, null, and only alphanumeric characters
    pageSize: z.number().int().min(1).max(100).optional(), // Integer between 1 and 100
    pageInd: z.number().int().min(0).max(10000).optional(), // Integer between 0 and 10000
  });

  @inject(BINDINGS.CategoriesRepository)
  private _categoriesRepository: any;

  async execute(
    this: Getcategories,
    validatedUserData: any
  ): Promise<Category[]> {
    const { pageSize = 100, pageInd = 0, search = "" } = validatedUserData;

    try {
      logger.info(`Getcategories:execute`);

      return this._categoriesRepository.findAll(pageInd, pageSize, search);
    } catch (error) {
      logger.error("Getcategories:error", error);
      if (typeof error === "string") {
        throw new Error(error);
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
}

export default Getcategories;
