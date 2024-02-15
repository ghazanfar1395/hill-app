exports.up = function (knex) {
  return knex.schema.table("opportunities", function (table) {
    table.string("opportunity_location");
  });
};

exports.down = function (knex) {
  return knex.schema.table("opportunities", function (table) {
    table.dropColumn("opportunity_location");
  });
};
