import { Knex } from "../../../common/types";
import { v4 as uuid } from "uuid";
import { nanoid } from "nanoid";
import { hashPassword } from "../../../modules/users/authUtils";
import appConfig from "../../../config/app";

const { SKIP_IF_ALREADY_RUN } = process.env;

export async function seed(knex: Knex): Promise<any> {
  // check if can skip seed phase
  if (SKIP_IF_ALREADY_RUN === "true") {
    const adminUser = await knex("user").where("user_name", "admin").first();

    if (adminUser) {
      console.log("Skip seed phase because flag SKIP_IF_ALREADY_RUN is true");
      return;
    }
  }

  await knex("expense").del();
  await knex("category").del();
  await knex("sheet").del();
  await knex("user_refresh_tokens").del();
  await knex("user").del();

  // make constant admin id
  const adminId = uuid();
  const refreshToken = "50ecc6dcbd1a";

  const [u1, u2] = Array(2)
    .fill(null)
    .map(() => uuid());

  // Inserts seed entries
  await knex("user").insert([
    {
      id: adminId,
      user_name: "admin",
      email: "admin@expenses-api.com",
      role: "admin",
      password: hashPassword("123456"),
    },
    {
      id: u1,
      user_name: "Marc",
      email: "marc@expenses-api.com",
      role: "registered",
      password: hashPassword("123456"),
    },
    {
      id: u2,
      user_name: "Hicham",
      email: "hicham@expenses-api.com",
      role: "registered",
      password: hashPassword("123456"),
    },
  ]);

  // 7 days refresh token expiration
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await knex("user_refresh_tokens").insert([
    {
      user_id: adminId,
      client_id: appConfig.defaultClientId,
      expires,
      refresh_token: refreshToken,
    },
    ...[u1, u2].map((uId) => ({
      user_id: uId,
      client_id: appConfig.defaultClientId,
      expires,
      refresh_token: nanoid(),
    })),
  ]);

  await knex("sheet").insert([
    {
      id: knex.raw("uuid_generate_v4()"),
      name: "Monthly Budget",
      max_budget: 1500.0,
      description: "Personal monthly budget for living expenses.",
      creation_date: knex.fn.now(),
      user_id: u1,
    },
    {
      id: knex.raw("uuid_generate_v4()"),
      name: "Vacation Budget",
      max_budget: 5000.0,
      description: "Vacation plan for 2024.",
      creation_date: knex.fn.now(),
      user_id: u1,
    },
  ]);

  await knex("category").insert([
    { id: knex.raw("uuid_generate_v4()"), name: "Groceries" },
    { id: knex.raw("uuid_generate_v4()"), name: "Utilities" },
    { id: knex.raw("uuid_generate_v4()"), name: "Entertainment" },
    { id: knex.raw("uuid_generate_v4()"), name: "Transport" },
  ]);

  const [groceriesCategory] = await knex("category")
    .where({ name: "Groceries" })
    .select("id");
  const [utilitiesCategory] = await knex("category")
    .where({ name: "Utilities" })
    .select("id");

  // Get IDs for sheets
  const [monthlySheet] = await knex("sheet")
    .where({ name: "Monthly Budget" })
    .select("id");
  const [vacationSheet] = await knex("sheet")
    .where({ name: "Vacation Budget" })
    .select("id");

  await knex("expense").insert([
    {
      id: knex.raw("uuid_generate_v4()"),
      name: "Grocery Shopping",
      amount: 200.5,
      expected: 150.0,
      category_id: groceriesCategory.id,
      sheet_id: monthlySheet.id,
    },
    {
      id: knex.raw("uuid_generate_v4()"),
      name: "Electricity Bill",
      amount: 100.0,
      expected: 90.0,
      category_id: utilitiesCategory.id,
      sheet_id: monthlySheet.id,
    },
    {
      id: knex.raw("uuid_generate_v4()"),
      name: "Plane Tickets",
      amount: 1200.0,
      expected: 1000.0,
      category_id: utilitiesCategory.id,
      sheet_id: vacationSheet.id,
    },
  ]);
}
