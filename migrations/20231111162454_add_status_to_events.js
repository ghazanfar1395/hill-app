exports.up = function (knex) {
  return knex.schema.table("events", (table) => {
    table.string("status");
  });
};

exports.down = function (knex) {
  return knex.schema.table("events", (table) => {
    table.dropColumn("status");
  });
};
