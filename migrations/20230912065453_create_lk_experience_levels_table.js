exports.up = function (knex) {
  return knex.schema.createTable(
    "public.lk_experience_levels",
    function (table) {
      table.increments("id").primary();
      table.string("level_name");
    }
  );
};

exports.down = function (knex) {
  return knex.schema.dropTable("public.lk_experience_levels");
};
