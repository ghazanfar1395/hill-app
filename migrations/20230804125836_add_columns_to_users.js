exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.string("company_name");
    table.string("experience_level");
    table.string("job_title");
    table.string("graduation_year");
    table.string("institute_name");
    table.string("subject_name");
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("company_name");
    table.dropColumn("experience_level");
    table.dropColumn("job_title");
    table.dropColumn("graduation_year");
    table.dropColumn("institute_name");
    table.dropColumn("subject_name");
  });
};
