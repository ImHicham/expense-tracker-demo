import BaseRepository from "../../common/baseRepository";
import { injectable } from "../../common/types";
import logger from "../../infra/loaders/logger";
import { Expense } from "./types";

@injectable()
class ExpensesRepository extends BaseRepository {
  async findAll(
    pageInd: number,
    pageSize: number,
    search: string
  ): Promise<Expense[]> {
    const qb = this.dbAccess!("expenses").returning("*");
    logger.info("ExpensesRepository:findAll");
    return this.wrapWithPaginationAndSearch(qb, pageInd, pageSize, [
      { field: "content", search },
    ]);
  }

  async findUserExpenses(
    userId: string,
    pageInd: number,
    pageSize: number,
    search: string
  ): Promise<Expense[] | undefined> {
    const qb = this.dbAccess<Expense>("expense")
      .select("*")
      .where("user_id", userId);

    return this.wrapWithPaginationAndSearch(qb, pageInd, pageSize, [
      { field: "content", search },
    ]);
  }

  async findExpensesBySheetId(
    expenseSheetId: string,
    pageInd: number,
    pageSize: number,
    search: string,
    expand?: string
  ): Promise<Expense[] | undefined> {
    let qb;
    if (expand === "category") {
      qb = this.dbAccess<Expense>("expense")
        .select("expense.*", "category.name as category_name")
        .join("category", "expense.category_id", "category.id")
        .where("expense.sheet_id", expenseSheetId);
    } else {
      qb = this.dbAccess<Expense>("expense")
        .select("*")
        .where("sheet_id", expenseSheetId);
    }

    return this.wrapWithPaginationAndSearch(qb, pageInd, pageSize, [
      { field: "name", search },
    ]);
  }

  async addExpense(expense: Expense) {
    return this.dbAccess("expense").insert(expense).returning("id");
  }

  async updateExpense(expenseId: string, userId: string, content: string) {
    return this.dbAccess("expense")
      .update({
        content,
      })
      .where("id", expenseId)
      .andWhere("user_id", userId);
  }

  async removeExpense(expenseId: string) {
    return this.dbAccess("expense").where("id", expenseId).del();
  }
}

export default ExpensesRepository;
