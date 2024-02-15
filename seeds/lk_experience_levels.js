exports.seed = function (knex) {
  // Deletes ALL existing entries and then inserts new data
  return knex("lk_experience_levels")
    .del()
    .then(function () {
      return knex("lk_experience_levels").insert([
        { level_name: "Student (High School/Sixth Form)" },
        { level_name: "Student (College/University)" },
        { level_name: "Experienced Hire (less than 2 years)" },
        { level_name: "Experienced Hire (2-5 years)" },
        { level_name: "Experienced Hire (5-10 years)" },
        { level_name: "Senior Leader (10+ years)" },
        { level_name: "Executive/C-Suite" },
      ]);
    });
};
