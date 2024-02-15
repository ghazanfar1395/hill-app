exports.up = function (knex) {
  return knex.schema.table("user_educations", function (table) {
    table.string("subject_name");
  });
};

exports.down = function (knex) {
  return knex.schema.table("user_educations", function (table) {
    table.dropColumn("subject_name");
  });
};
