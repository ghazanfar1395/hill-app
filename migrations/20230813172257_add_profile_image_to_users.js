exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.string("profile_image"); // Add the new column
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("profile_image"); // Rollback by dropping the column
  });
};
