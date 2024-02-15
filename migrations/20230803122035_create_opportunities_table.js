// migrations/20230803120000_create_opportunities_table.js
exports.up = function (knex) {
  return knex.schema.createTable("opportunities", function (table) {
    table.increments("id").primary();
    table.string("opportunity_title");
    table.timestamp("start_date");
    table.timestamp("closing_date");
    table.string("location");
    table.string("opportunity_type");
    table.string("office_type");
    table.string("industry");
    table.string("opportunity_link");
    table.text("opportunity_summary");
    table.text("opportunity_content");
    table.string("opportunity_image_link");
    table.timestamp("created_at");
    table.timestamp("updated_at");
    table.integer("company_id");
    table.integer("created_by");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("opportunities");
};
