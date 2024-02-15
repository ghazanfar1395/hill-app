exports.up = function (knex) {
  return knex.schema.table("user_educations", function (table) {
    table.dropColumn("start_month");
    table.dropColumn("start_year");
    table.dropColumn("end_month");
    table.dropColumn("end_year");
    table.dropColumn("subject");
    table.dropColumn("activities");
    table.timestamp("start_date", { useTz: true });
    table.timestamp("end_date").nullable();
    table.boolean("is_current_studying").defaultTo(false);
    table.integer("education_level_id");
  });
};

exports.down = function (knex) {
  return knex.schema.table("user_educations", function (table) {
    table.integer("start_month");
    table.integer("start_year");
    table.integer("end_month");
    table.integer("end_year");
    table.string("subject");
    table.string("activities");
    table.dropColumn("start_date");
    table.dropColumn("end_date");
    table.dropColumn("is_current_studying");
    table.dropColumn("education_level_id");
  });
};
