exports.up = function (knex) {
  return knex.schema.alterTable("opportunities", function (table) {
    table.string("hourly_pay");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("opportunities", function (table) {
    table.dropColumn("hourly_pay");
  });
};
