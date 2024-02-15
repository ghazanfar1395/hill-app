exports.up = function (knex) {
  return knex.schema.createTable("user_skills", function (table) {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table.integer("skill_id").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    // foreign key constraint
    table
      .foreign("skill_id")
      .references("id")
      .inTable("lk_skills")
      .onDelete("NO ACTION")
      .onUpdate("NO ACTION");

    //  unique constraint
    table.unique(["user_id", "skill_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_skills");
};
