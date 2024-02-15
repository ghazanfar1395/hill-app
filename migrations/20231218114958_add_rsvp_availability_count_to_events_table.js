exports.up = function (knex) {
  return knex.schema.alterTable("events", function (table) {
    table.integer("rsvp_availability_count");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("events", function (table) {
    table.dropColumn("rsvp_availability_count");
  });
};
