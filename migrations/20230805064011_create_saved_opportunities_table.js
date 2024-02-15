exports.up = function (knex) {
  return knex.schema.createTable("saved_opportunities", function (table) {
    table.increments("id").primary();
    table.integer("opportunity_id").notNullable();
    table.integer("user_id").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("saved_opportunities");
};
