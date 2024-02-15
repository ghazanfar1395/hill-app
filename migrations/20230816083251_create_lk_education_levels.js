exports.up = function (knex) {
  return knex.schema.createTable("lk_education_levels", function (table) {
    table.increments("id").primary();
    table.string("level_name");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("lk_education_levels");
};
