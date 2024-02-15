exports.seed = function (knex) {
  // Deletes ALL existing entries and then inserts new data
  return knex("lk_industries")
    .del()
    .then(function () {
      return knex("lk_industries").insert([
        { industry_name: "Technology" },
        { industry_name: "Science & Pharma" },
        { industry_name: "Engineering" },
        { industry_name: "Media and Advertising" },
        { industry_name: "PR & Communications" },
        { industry_name: "Banking & Finance" },
        { industry_name: "Public Sector" },
        { industry_name: "Construction & Real Estate" },
        { industry_name: "Other" },
      ]);
    });
};
