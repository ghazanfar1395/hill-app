exports.up = function (knex) {
  return knex.schema.table("public.opportunities", function (table) {
    table.timestamp("expires_at", { useTz: false });
  });
};

exports.down = function (knex) {
  return knex.schema.table("public.opportunities", function (table) {
    table.dropColumn("expires_at");
  });
};
