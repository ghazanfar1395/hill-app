exports.up = function (knex) {
  return knex.schema.raw(
    "ALTER TABLE IF EXISTS public.user_skills DROP CONSTRAINT IF EXISTS fk_skill_id"
  );
};

exports.down = function (knex) {
  return knex.schema.raw(
    "ALTER TABLE public.user_skills ADD CONSTRAINT fk_skill_id FOREIGN KEY (skill_id) REFERENCES skills(id)"
  );
};
