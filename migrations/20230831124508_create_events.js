exports.up = function (knex) {
  return knex.schema.createTable("events", function (table) {
    table.increments("id").primary();
    table.string("event_name");
    table.string("event_location");
    table.timestamp("start_date", { useTz: false });
    table.timestamp("end_date", { useTz: false });
    table.string("start_time");
    table.string("end_time");
    table.specificType("hashtags", "VARCHAR[]");
    table.text("event_url");
    table.text("event_image_link");
    table.timestamp("created_at", { useTz: false });
    table.timestamp("updated_at", { useTz: false });
    table.integer("created_by");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("events");
};
