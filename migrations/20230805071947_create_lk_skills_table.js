exports.up = function (knex) {
  return knex.schema.createTable("lk_skills", function (table) {
    table.increments("id").primary();
    table.string("skill_name").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("lk_skills");
};
