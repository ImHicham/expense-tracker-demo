import BaseRepository from "../../common/baseRepository";
import { injectable } from "../../common/types";
import logger from "../../infra/loaders/logger";
import { ExpenseSheet } from "./types";

@injectable()
class ExpenseSheetsRepository extends BaseRepository {
  async findAll(
    pageInd: number,
    pageSize: number,
    search: string
  ): Promise<ExpenseSheet[]> {
    const qb = this.dbAccess!("sheet").returning("*");
    logger.info("ExpenseSheetsRepository:findAll");
    return this.wrapWithPaginationAndSearch(qb, pageInd, pageSize, [
      { field: "name", search },
    ]);
  }

  async findUserExpenseSheets(
    userId: string,
    pageInd: number,
    pageSize: number,
    search: string
  ): Promise<ExpenseSheet[] | undefined> {
    const qb = this.dbAccess<ExpenseSheet>("sheet")
      .select("*")
      .where("user_id", userId);

    return this.wrapWithPaginationAndSearch(qb, pageInd, pageSize, [
      { field: "name", search },
    ]);
  }

  async findExpenseSheetById(
    expenseSheetId: string,
    pageInd: number,
    pageSize: number,
    search: string
  ): Promise<ExpenseSheet | undefined> {
    const qb = this.dbAccess<ExpenseSheet>("sheet")
      .select("*")
      .where("id", expenseSheetId);

    return this.wrapWithPaginationAndSearch(qb, pageInd, pageSize, [
      { field: "name", search },
    ]);
  }

  async addExpenseSheet(userId: string, expenseSheet: ExpenseSheet) {
    return this.dbAccess("sheet").insert(expenseSheet).returning("id");
  }

  async updateExpenseSheet(
    expenseSheetId: string,
    userId: string,
    content: string
  ) {
    return this.dbAccess("sheet")
      .update({
        content,
      })
      .where("id", expenseSheetId)
      .andWhere("user_id", userId);
  }

  async removeExpenseSheet(expenseSheetId: string) {
    return this.dbAccess("sheet").where("id", expenseSheetId).del();
  }
}

export default ExpenseSheetsRepository;
