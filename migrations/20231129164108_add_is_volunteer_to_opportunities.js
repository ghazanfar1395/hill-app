exports.up = function (knex) {
  return knex.schema.alterTable("opportunities", function (table) {
    table.boolean("is_volunteer").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("opportunities", function (table) {
    table.dropColumn("is_volunteer");
  });
};
