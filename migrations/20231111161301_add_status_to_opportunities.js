exports.up = function (knex) {
  return knex.schema.alterTable("opportunities", (table) => {
    table.string("status");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("opportunities", (table) => {
    table.dropColumn("status");
  });
};
