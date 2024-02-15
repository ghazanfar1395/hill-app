exports.up = function (knex) {
  return knex.schema.createTable("user_educations", function (table) {
    table.increments("id").primary();
    table.integer("user_id");
    table.string("institution_name");
    table.string("start_month");
    table.integer("start_year");
    table.string("end_month");
    table.integer("end_year");
    table.string("subject");
    table.text("activities");
    table.text("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_educations");
};
