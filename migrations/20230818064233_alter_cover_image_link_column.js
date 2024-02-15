exports.up = function (knex) {
  return knex.schema.alterTable("projects", function (table) {
    table.text("cover_image_link").collate('pg_catalog."default"').alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("projects", function (table) {
    table.string("cover_image_link").alter();
  });
};
