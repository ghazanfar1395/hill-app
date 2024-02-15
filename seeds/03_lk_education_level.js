exports.seed = function (knex) {
  // Deletes ALL existing entries and then inserts new data
  return knex("lk_education_levels")
    .del()
    .then(function () {
      return knex("lk_education_levels").insert([
        { level_name: "High School/Secondary School" },
        { level_name: "Sixth Form" },
        { level_name: "University/College" },
        { level_name: "Postgraduate" },
        { level_name: "PhD" },
      ]);
    });
};
