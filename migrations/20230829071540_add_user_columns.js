exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    // Add the new columns
    table.string("employee_count");
    table.string("website_link");
    table.string("video_url_one");
    table.string("video_url_two");
    table.string("external_link");
    table.json("showcase");
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    // Rollback the changes (remove the added columns)
    table.dropColumn("employee_count");
    table.dropColumn("website_link");
    table.dropColumn("video_url_one");
    table.dropColumn("video_url_two");
    table.dropColumn("external_link");
    table.dropColumn("showcase");
  });
};
