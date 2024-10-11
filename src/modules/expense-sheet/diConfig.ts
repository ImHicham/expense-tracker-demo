import { BINDINGS } from "../../common/constants";
import { Container } from "../../common/types";

import ExpenseSheetsRepository from "./repository";

export default (container: Container) => {
  container
    .bind<ExpenseSheetsRepository>(BINDINGS.ExpenseSheetsRepository)
    .to(ExpenseSheetsRepository);
};
