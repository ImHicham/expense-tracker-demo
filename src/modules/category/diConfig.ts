import { BINDINGS } from "../../common/constants";
import { Container } from "../../common/types";

import CategoriesRepository from "./repository";

export default (container: Container) => {
  container
    .bind<CategoriesRepository>(BINDINGS.CategoriesRepository)
    .to(CategoriesRepository);
};
