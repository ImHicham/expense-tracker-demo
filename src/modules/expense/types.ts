interface Expense {
  id: string;
  name: string;
  amount: string;
  expected: string;
  categoryId: string;
  sheetId: string;
  createdAt: Date;
  updatedAt: Date;
}
export { Expense };
