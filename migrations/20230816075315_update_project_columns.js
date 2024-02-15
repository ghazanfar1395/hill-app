exports.up = function (knex) {
  return knex.schema.table("projects", function (table) {
    table.dropColumn("project_description");
    table.dropColumn("industry_id");
    table.dropColumn("skill_ids");
    table.timestamp("start_date").nullable();
    table.timestamp("end_date").nullable();
    table.string("project_url");
  });
};

exports.down = function (knex) {
  return knex.schema.table("projects", function (table) {
    table.string("project_description");
    table.integer("industry_id");
    table.specificType("skill_ids", "integer[]");
    table.dropColumn("start_date");
    table.dropColumn("end_date");
    table.dropColumn("project_url");
  });
};
