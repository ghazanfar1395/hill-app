exports.up = function (knex) {
  return knex.schema.table("public.opportunities", function (table) {
    table.dropColumn("location");
    table.dropColumn("title");
    table.dropColumn("salary_offered");
    table.dropColumn("type");
    table.string("opportunity_role");
    table.specificType("hashtags", "character varying[]");
    table.specificType("requirements", "text[]");
    table.integer("estimated_salary");
    table.boolean("is_hourly").defaultTo(false);
    table.boolean("is_active").defaultTo(true);
    table.text("apply_link");
  });
};

exports.down = function (knex) {
  return knex.schema.table("public.opportunities", function (table) {
    table.string("location");
    table.string("title");
    table.string("salary_offered");
    table.string("type");
    table.dropColumn("opportunity_role");
    table.dropColumn("hashtags");
    table.dropColumn("requirements");
    table.dropColumn("estimated_salary");
    table.dropColumn("is_hourly");
    table.dropColumn("apply_link");
    table.dropColumn("is_active");
  });
};
