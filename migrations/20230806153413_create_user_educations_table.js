// migrations/20230806120000_create_user_educations_table.js

exports.up = function (knex) {
  return knex.schema.createTable("user_experiences", function (table) {
    table.increments("id").primary();
    table.integer("user_id");
    table.string("title");
    table.string("employment_type");
    table.string("company_name");
    table.string("location");
    table.boolean("is_current_job");
    table.boolean("got_hired");
    table.string("start_date");
    table.integer("start_year");
    table.string("end_date");
    table.integer("end_year");
    table.text("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_experiences");
};
