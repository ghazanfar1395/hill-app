exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.specificType("skills", "character varying[]");
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("skills");
  });
};
