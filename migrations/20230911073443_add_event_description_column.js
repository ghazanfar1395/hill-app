exports.up = function (knex) {
  return knex.schema.alterTable("events", function (table) {
    table.text("event_description");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("events", function (table) {
    table.dropColumn("event_description");
  });
};
