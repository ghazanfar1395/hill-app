exports.up = function (knex) {
  return knex.schema.table("opportunities", (table) => {
    table.string("currency");
  });
};

exports.down = function (knex) {
  return knex.schema.table("opportunities", (table) => {
    table.dropColumn("currency");
  });
};
