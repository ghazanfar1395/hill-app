exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.boolean("is_mailing_enabled").defaultTo(false); // Add the new column with a default value
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("is_mailing_enabled"); // Drop the column if rolling back the migration
  });
};
