exports.seed = function (knex) {
  // Deletes ALL existing entries and then inserts new data
  return knex("lk_skills")
    .del()
    .then(function () {
      return knex("lk_skills").insert([
        { skill_name: "UX/UI" },
        { skill_name: "Coding" },
        { skill_name: "Engineering" },
        { skill_name: "Project Management" },
        { skill_name: "Executive Leadership" },
        { skill_name: "Coding" },
        { skill_name: "Organization" },
        { skill_name: "Leadership" },
        { skill_name: "Decision Making" },
        { skill_name: "Problem Solving" },
        { skill_name: "Communication" },
        { skill_name: "Initiative" },
        { skill_name: "Curiosity" },
        { skill_name: "Teamwork" },
        { skill_name: "Collaboration" },
        { skill_name: "Multi-Lingual" },
        { skill_name: "Stakeholder Management" },
        { skill_name: "Conflict Resolution" },
        { skill_name: "Python" },
        { skill_name: "Copywriting" },
        { skill_name: "IT Skills" },
        { skill_name: "Javascript" },
        { skill_name: "Data Analysis" },
        { skill_name: "Listening" },
        { skill_name: "Creativity" },
        { skill_name: "Critical Thinking" },
        { skill_name: "Public Speaking" },
        { skill_name: "Agility" },
        { skill_name: "Management" },
        { skill_name: "Presentation" },
        { skill_name: "Flexibility" },
      ]);
    });
};
