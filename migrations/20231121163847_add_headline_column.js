exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.text("headline");
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("headline");
  });
};
