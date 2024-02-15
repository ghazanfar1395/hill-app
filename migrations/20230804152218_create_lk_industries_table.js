exports.up = function (knex) {
  return knex.schema.createTable("lk_industries", function (table) {
    table.increments("id").primary();
    table.string("industry_name");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("lk_industries");
};
