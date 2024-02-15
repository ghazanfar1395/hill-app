exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("first_name");
    table.string("last_name");
    table.string("industry");
    table.string("age_range");
    table.boolean("relocate").defaultTo(false);
    table.string("location");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.string("email").notNullable().unique();
    table.text("password");
    // add role id in this schema
    table.integer("role_id").notNullable();
    table
      .foreign("role_id")
      .references("id")
      .inTable("roles")
      .onUpdate("NO ACTION")
      .onDelete("NO ACTION");
    table.string("password_salt");
    table.string("password_reset_token");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
