exports.up = function (knex) {
  return knex.schema.table("public.users", function (table) {
    table.integer("experience_level_id");
  });
};

exports.down = function (knex) {
  return knex.schema.table("public.users", function (table) {
    table.dropColumn("experience_level_id");
  });
};
