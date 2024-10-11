export enum BINDINGS {
  KnexConnection = "KnexConnection",
  DbAccess = "DbAccess",
  Redis = "Redis",
  BaseRepository = "BaseRepository",
  MemoryStorage = "MemoryStorage",

  // auth
  LoginUser = "LoginUser",
  RegisterUser = "RegisterUser",
  RefreshToken = "RefreshToken",

  // users
  UsersRepository = "UsersRepository",
  GetUser = "GetUser",
  GetUsers = "GetUsers",

  // expenses
  ExpensesRepository = "ExpensesRepository",
  GetExpenses = "GetExpenses",
  GetUserExpenses = "GetUserExpenses",

  //expense sheet
  ExpenseSheetsRepository = "ExpenseSheetsRepository",
  GetExpenseSheets = "GetExpenseSheets",
  GetUserExpenseSheets = "GetUserExpenseSheets",

  //expense sheet
  CategoriesRepository = "CategoriesRepository",
  GetCategory = "GetCategory",
  GetUserCategories = "GetUserCategories",
}
