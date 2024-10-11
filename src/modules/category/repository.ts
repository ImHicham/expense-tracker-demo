import BaseRepository from "../../common/baseRepository";
import { injectable } from "../../common/types";
import logger from "../../infra/loaders/logger";
import { Category } from "./types";

@injectable()
class CategoriesRepository extends BaseRepository {
  async findAll(
    pageInd: number,
    pageSize: number,
    search: string
  ): Promise<Category[]> {
    const qb = this.dbAccess!("category").returning("*");
    logger.info("categoriesRepository:findAll");
    return this.wrapWithPaginationAndSearch(qb, pageInd, pageSize, [
      { field: "content", search },
    ]);
  }

  async findUsercategories(
    userId: string,
    pageInd: number,
    pageSize: number,
    search: string
  ): Promise<Category[] | undefined> {
    const qb = this.dbAccess<Category>("category")
      .select("*")
      .where("user_id", userId);

    return this.wrapWithPaginationAndSearch(qb, pageInd, pageSize, [
      { field: "content", search },
    ]);
  }

  async addcategory(category: Category) {
    return this.dbAccess("category").insert(category).returning("id");
  }

  async updateCategory(categoryId: string, userId: string, content: string) {
    return this.dbAccess("category")
      .update({
        content,
      })
      .where("id", categoryId)
      .andWhere("user_id", userId);
  }

  async removeCategory(categoryId: string, userId: string) {
    return this.dbAccess("category")
      .where("id", categoryId)
      .andWhere("user_id", userId)
      .del();
  }
}

export default CategoriesRepository;
