exports.up = function (knex) {
  return knex.schema.table("user_experiences", function (table) {
    table.dropColumn("employment_type");
    table.dropColumn("location");
    table.dropColumn("got_hired");
    table.dropColumn("start_year");
    table.dropColumn("end_year");
    table.renameColumn("title", "job_title");
    table.boolean("is_remote");
    table.boolean("is_full_time");
    table.boolean("is_part_time");
    table.boolean("is_contract");
  });
};

exports.down = function (knex) {
  return knex.schema.table("user_experiences", function (table) {
    table.string("employment_type");
    table.string("location");
    table.boolean("got_hired");
    table.date("start_date");
    table.integer("start_year");
    table.date("end_date");
    table.integer("end_year");
    table.renameColumn("job_title", "title");
    table.dropColumn("is_remote");
    table.dropColumn("is_full_time");
    table.dropColumn("is_part_time");
    table.dropColumn("is_contract");
  });
};
