exports.up = function (knex) {
  return knex.schema.createTable("public.rsvp_events", function (table) {
    table.increments("id").primary();
    table.integer("event_id").notNullable();
    table.integer("user_id").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("public.rsvp_events");
};
