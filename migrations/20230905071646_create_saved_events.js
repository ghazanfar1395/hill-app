exports.up = function (knex) {
  return knex.schema.createTable("saved_events", function (table) {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table.integer("event_id");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("saved_events");
};
