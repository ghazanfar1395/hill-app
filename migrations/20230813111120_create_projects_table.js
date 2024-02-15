exports.up = function (knex) {
  return knex.schema.createTable("projects", function (table) {
    table.increments("id").primary();
    table.string("project_title");
    table.text("project_summary");
    table.string("cover_image_link");
    table.text("project_description");
    table.integer("industry_id");
    table.specificType("skill_ids", "integer[]");
    table.integer("created_by");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("projects");
};
