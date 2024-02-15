exports.up = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.text("profile_image").collate('pg_catalog."default"').alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("users", function (table) {
    table.string("profile_image").alter();
  });
};
