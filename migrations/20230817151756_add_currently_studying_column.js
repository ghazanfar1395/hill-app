exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.boolean("currently_studying");
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("currently_studying");
  });
};
