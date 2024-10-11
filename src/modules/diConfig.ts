import { Container } from "../common/types";
import usersDiConfig from "./users/diConfig";
import expensesDiConfig from "./expense/diConfig";
import expenseSheetDiConfig from "./expense-sheet/diConfig";
import categoriesDiConfig from "./category/diConfig";

export default (container: Container) => {
  usersDiConfig(container);
  expensesDiConfig(container);
  expenseSheetDiConfig(container);
  categoriesDiConfig(container);
};
