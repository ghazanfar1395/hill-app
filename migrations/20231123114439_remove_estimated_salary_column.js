exports.up = function (knex) {
  return knex.schema.alterTable("opportunities", (table) => {
    table.dropColumn("estimated_salary");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("opportunities", (table) => {
    table.string("estimated_salary");
  });
};
