exports.up = function (knex) {
  return knex.schema.createTable("notifications", function (table) {
    table.increments("id").primary();
    table.string("notification_type");
    table.integer("to_id");
    table.string("module");
    table.integer("module_id");
    table.text("description");
    table.integer("created_by");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.boolean("is_read").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("notifications");
};
