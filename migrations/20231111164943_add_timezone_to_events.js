exports.up = function (knex) {
  return knex.schema.table("events", (table) => {
    table.string("timezone");
  });
};

exports.down = function (knex) {
  return knex.schema.table("events", (table) => {
    table.dropColumn("timezone");
  });
};
