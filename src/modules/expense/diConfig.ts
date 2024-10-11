import { BINDINGS } from "../../common/constants";
import { Container } from "../../common/types";

import ExpensesRepository from "./repository";

export default (container: Container) => {
  container
    .bind<ExpensesRepository>(BINDINGS.ExpensesRepository)
    .to(ExpensesRepository);
};
