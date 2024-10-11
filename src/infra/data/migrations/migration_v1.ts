import { Knex } from "../../../common/types";

export async function up(knex: Knex): Promise<any> {
  // create extension to auto generate uuid
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable("user", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();

    table.string("user_name", 100).notNullable();
    table.string("email", 50);
    // anonym when user do not provide any profile info (email etc.)
    table.enu("role", ["anonym", "registered", "admin"]).notNullable();
    table.string("password", 100);

    table.timestamps(true, true);
  });

  await knex.schema.createTable("user_refresh_tokens", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();

    table.uuid("user_id").notNullable();
    table.foreign("user_id").references("user.id");

    table.string("client_id", 100).notNullable();
    table.string("refresh_token", 200).notNullable();

    table.timestamp("expires").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("sheet", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("name", 100).notNullable(); // Name of the sheet
    table.decimal("max_budget", 14, 2).notNullable(); // Max budget for the sheet
    table.timestamp("creation_date").defaultTo(knex.fn.now()); // Creation date
    table.string("description", 1000); // Description of the sheet
    table.uuid("user_id").notNullable(); // Foreign key to Category table
    table.foreign("user_id").references("user.id").onDelete("CASCADE");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("category", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("name", 100).notNullable(); // Category name
    table.timestamps(true, true);
  });

  await knex.schema.createTable("expense", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("name", 200).notNullable(); // Name of the expense
    table.decimal("amount", 14, 2).notNullable(); // Actual amount
    table.decimal("expected", 14, 2); // Expected amount (optional)

    table.uuid("category_id").notNullable(); // Foreign key to Category table
    table.foreign("category_id").references("category.id").onDelete("CASCADE");

    table.uuid("sheet_id").notNullable(); // Foreign key to Sheet table
    table.foreign("sheet_id").references("sheet.id").onDelete("CASCADE");

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable("expense");
  await knex.schema.dropTable("category");
  await knex.schema.dropTable("sheet");
  await knex.schema.dropTable("user_refresh_tokens");
  await knex.schema.dropTable("user");
}
