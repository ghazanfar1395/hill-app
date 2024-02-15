exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    // Drop the columns you want to remove
    table.dropColumn("first_name");
    table.dropColumn("last_name");
    table.dropColumn("industry");
    table.dropColumn("age_range");
    table.dropColumn("experience_level");
    table.dropColumn("graduation_year");
    table.dropColumn("institute_name");
    table.dropColumn("subject_name");
    table.text("about");
    table.integer("industry_id");
    table.boolean("is_active").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.string("first_name");
    table.string("last_name");
    table.string("industry");
    table.string("age_range");
    table.string("experience_level");
    table.integer("graduation_year");
    table.string("institute_name");
    table.string("subject_name");
    table.dropColumn("about");
    table.dropColumn("industry_id");
    table.dropColumn("is_active");
  });
};
