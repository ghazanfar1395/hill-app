exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.integer("created_by");
    table.string("full_name");
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("created_by");
    table.dropColumn("full_name");
  });
};
