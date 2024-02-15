exports.up = function (knex) {
  return Promise.all([
    // Drop columns if they exist
    knex.schema.table("users", function (table) {
      table.dropColumn("video_url_one");
      table.dropColumn("video_url_two");
      table.dropColumn("external_link");
    }),

    // Add new columns
    knex.schema.table("users", function (table) {
      table.string("video_link");
      table.json("external_links");
      table.string("hq_address");
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    // Remove the columns added in the 'up' migration
    knex.schema.table("users", function (table) {
      table.dropColumn("video_link");
      table.dropColumn("external_links");
      table.dropColumn("hq_address");
    }),
  ]);
};
