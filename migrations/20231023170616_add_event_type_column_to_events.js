exports.up = function (knex) {
  return knex.schema.alterTable("events", function (table) {
    table.string("event_type");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("events", function (table) {
    table.dropColumn("event_type");
  });
};
