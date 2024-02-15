exports.up = function (knex) {
  return knex.schema.table("opportunities", function (table) {
    table.dropColumn("opportunity_title");
    table.dropColumn("start_date");
    table.dropColumn("closing_date");
    table.dropColumn("opportunity_type");
    table.dropColumn("office_type");
    table.dropColumn("industry");
    table.dropColumn("opportunity_link");
    table.dropColumn("opportunity_summary");
    table.dropColumn("opportunity_content");
    table.dropColumn("opportunity_image_link");
    table.string("title");
    table.string("salary_offered");
    table.text("image_path");
    table.text("description");
    table.specificType("type", "character varying[]");
  });
};

exports.down = function (knex) {
  return knex.schema.table("opportunities", function (table) {
    table.dropColumn("type");
    table.dropColumn("title");
    table.dropColumn("salary_offered");
    table.dropColumn("image_path");
    table.dropColumn("description");
  });
};
