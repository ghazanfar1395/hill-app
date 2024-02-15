import UserSkillsModel from "../models/user_skills.model";
import UserEducationModel from "../models/user_education.model";
import UserExperienceModel from "../models/user_experience.model";
import UserMemberModel from "../models/saved_members.model";
import UserModel from "../models/user.model";
import RoleModel from "../models/role.model";
import EventModel from "../models/event.model";
import OpportunityModel from "../models/opportunity.model";
import { InternalError } from "../core/api-error";

// export async function upsertUserSkills(userId, skillId) {
//   try {
//     const existSkill = await UserSkillsModel.query().findOne({
//       user_id: userId,
//       skill_id: skillId,
//     });

//     if (existSkill) {
//       return await UserSkillsModel.query().delete().where({
//         user_id: userId,
//         skill_id: skillId,
//       });
//     }

//     return await UserSkillsModel.query().insert({
//       user_id: userId,
//       skill_id: skillId,
//     });
//   } catch (err) {
//     throw new InternalError(err.toString());
//   }
// }

export async function upsertUserSkills(userId, skillIds) {
  try {
    // Fetch existing user skills
    const existingSkills = await UserSkillsModel.query().where({
      user_id: userId,
    });

    // Convert the existing skills into an array of skill IDs
    const existingSkillIds = existingSkills.map((skill) => skill.skill_id);

    // Determine the skill IDs to be added and removed
    const skillsToAdd = skillIds.filter(
      (skillId) => !existingSkillIds.includes(skillId)
    );
    const skillsToRemove = existingSkillIds.filter(
      (skillId) => !skillIds.includes(skillId)
    );

    // Remove skills that are no longer present in the array
    if (skillsToRemove.length > 0) {
      await UserSkillsModel.query()
        .delete()
        .where("user_id", userId)
        .whereIn("skill_id", skillsToRemove);
    }

    // Add new skills
    const newSkills = skillsToAdd.map((skillId) => ({
      user_id: userId,
      skill_id: skillId,
    }));

    if (newSkills.length > 0) {
      await UserSkillsModel.query().insert(newSkills);
    }

    return true;
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getUserSkillsList(userId) {
  try {
    return await UserSkillsModel.query()
      .select("user_id", "skill_id", "lk_skills.skill_name")
      .where({ user_id: userId })
      .join("lk_skills", "user_skills.skill_id", "lk_skills.id");
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function generateUserEducation(data) {
  try {
    return await UserEducationModel.query().insert(data);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function generateUserExperience(data) {
  try {
    return await UserExperienceModel.query().insert(data);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function updateUserEduction(data, eductionId) {
  try {
    return await UserEducationModel.query()
      .update(data)
      .where("id", eductionId)
      .returning("*");
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getUserDetail(data) {
  try {
    const currentTime = new Date();
    let userId = data.user_id;

    if (data.member_id) {
      userId = data.member_id;
    }

    let queryBuilder = UserModel.query()
      .findOne({ id: userId })
      .withGraphFetched(
        "[educations, experiences, projects, events,  opportunities]"
      )
      .modifyGraph("educations", (builder) =>
        builder
          .orderByRaw("CASE WHEN end_date IS NULL THEN 0 ELSE 1 END")
          .orderBy("end_date", "desc")
      )
      .modifyGraph("experiences", (builder) =>
        builder
          .orderByRaw("CASE WHEN end_date IS NULL THEN 0 ELSE 1 END")
          .orderBy("end_date", "desc")
      )
      .modifyGraph("projects", (builder) =>
        builder
          .orderByRaw("CASE WHEN end_date IS NULL THEN 0 ELSE 1 END")
          .orderBy("end_date", "desc")
      )
      .modifyGraph("events", (builder) =>
        builder
          .where("status", "published")
          .orderBy("created_at", "desc")
          .limit(3)
      )
      .modifyGraph("opportunities", (builder) =>
        builder
          .where("status", "published")
          .where("is_active", true)
          .where("expires_at", ">", currentTime)
          .orderBy("id", "desc")
          .limit(3)
      );

    if (data.member_id) {
      queryBuilder = queryBuilder
        .context({ dataUserId: data.user_id })
        .withGraphFetched("savedByUser");
    }

    const resp: any = await queryBuilder;

    if (!resp) {
      throw new InternalError("User not found");
    }

    // const resp: any = await UserModel.query()
    //   .findOne(findClause)
    //   .withGraphFetched(
    //     "[educations, experiences, projects, events,  opportunities]"
    //   )
    //   .modifyGraph("educations", (builder) =>
    //     builder
    //       .orderByRaw("CASE WHEN end_date IS NULL THEN 0 ELSE 1 END")
    //       .orderBy("end_date", "desc")
    //   )
    //   .modifyGraph("experiences", (builder) =>
    //     builder
    //       .orderByRaw("CASE WHEN end_date IS NULL THEN 0 ELSE 1 END")
    //       .orderBy("end_date", "desc")
    //   )
    //   .modifyGraph("projects", (builder) =>
    //     builder
    //       .orderByRaw("CASE WHEN end_date IS NULL THEN 0 ELSE 1 END")
    //       .orderBy("end_date", "desc")
    //   )
    //   .modifyGraph("events", (builder) =>
    //     builder.orderBy("created_at", "desc").limit(3)
    //   )
    //   .modifyGraph("opportunities", (builder) =>
    //     builder.orderBy("id", "desc").where("is_active", true).limit(3)
    //   );

    let { opportunities } = resp;
    if (opportunities.length > 0) {
      opportunities = opportunities.map((opportunity) => {
        let createdByDetail = {
          company_name: resp.company_name || "",
          email: resp.email || "",
          location: resp.location || "",
          id: resp.id || "",
          full_name: resp.full_name || "",
          profile_image: resp.profile_image || "",
        };
        opportunity.createdByDetail = createdByDetail;
        return opportunity;
      });
    }
    //delete resp.password;
    return resp;
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getUserById(userId) {
  try {
    return await UserModel.query().findOne({ id: userId });
  } catch (err) {
    throw new InternalError(err.toString());
  }
}
export async function updateUserExp(data, experienceId) {
  try {
    return await UserExperienceModel.query()
      .update(data)
      .where("id", experienceId)
      .returning("*");
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function deleteUserExp(experienceId, userId) {
  try {
    return await UserExperienceModel.query().delete().where({
      id: experienceId,
      user_id: userId,
    });
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getUserListing(type, page, limit, userId, filters) {
  try {
    // get all user of type candidate
    const currentTime = new Date();
    if (type === "candidate") {
      const roleDetail = await RoleModel.getRoleDetailByName(type);
      let queryBuilder = UserModel.query()
        .where("role_id", roleDetail.id)
        .where("is_active", true)
        .page(page, limit);

      if (filters && filters.full_name) {
        queryBuilder = queryBuilder.andWhereRaw('LOWER("full_name") like ?', [
          `%${filters.full_name.toLowerCase()}%`,
        ]);
      }

      if (userId) {
        queryBuilder = queryBuilder
          .context({ dataUserId: userId })
          .withGraphFetched("savedByUser");
      }
      return await queryBuilder;
    } else if (type === "company_admin") {
      const roleDetail = await RoleModel.getRoleDetailByName(type);

      let queryBuilder = UserModel.query()
        .where("role_id", roleDetail.id)
        .where("is_active", true)
        .page(page, limit);

      if (filters && filters.full_name) {
        queryBuilder = queryBuilder.andWhereRaw('LOWER("full_name") like ?', [
          `%${filters.full_name.toLowerCase()}%`,
        ]);
      }

      if (userId) {
        queryBuilder = queryBuilder
          .context({ dataUserId: userId })
          .withGraphFetched("savedByUser");
      }

      const users: any = (await queryBuilder).results;

      if (users.length > 0) {
        const userIds = users.map((user) => user.id);

        const opportunitiesCounts = await OpportunityModel.query()
          .select("created_by")
          .where("is_active", true)
          .where("expires_at", ">", currentTime)
          .count("* as opportunitiesCount")
          .whereIn("created_by", userIds)
          .groupBy("created_by");

        const eventsCounts = await EventModel.query()
          .select("created_by")
          .count("* as eventsCount")
          .whereIn("created_by", userIds)
          .groupBy("created_by");

        const usersWithCounts = users.map((user) => {
          const opportunitiesCount: any = opportunitiesCounts.find(
            (count) => count.created_by === user.id
          );
          const eventsCount: any = eventsCounts.find(
            (count) => count.created_by === user.id
          );

          delete user.password;

          return {
            ...user,
            opportunitiesCount: opportunitiesCount
              ? opportunitiesCount.opportunitiesCount
              : 0,
            eventsCount: eventsCount ? eventsCount.eventsCount : 0,
          };
        });

        // const usersWithOpportunityCount = users.map((user) => {
        //   const count: any = opportunitiesCounts.find(
        //     (count) => count.created_by === user.id
        //   );
        //   delete user.password;
        //   return {
        //     ...user,
        //     opportunitiesCount: count ? count.opportunitiesCount : 0,
        //   };
        // });

        const sortedUsers = usersWithCounts.sort(
          (a, b) => b.opportunitiesCount - a.opportunitiesCount
        );

        return { results: sortedUsers };
      } else {
        return { results: [] };
      }
    } else {
      throw new InternalError("Invalid type");
    }
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function deleteUserEdu(eductionId, userId) {
  try {
    return await UserEducationModel.query().delete().where({
      id: eductionId,
      user_id: userId,
    });
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function saveUserMember(data) {
  try {
    const existMember = await UserMemberModel.query().findOne(data);
    if (existMember) {
      return existMember;
    }

    return await UserMemberModel.query().insert(data).returning("*");
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function unSaveUserMember(data) {
  try {
    return await UserMemberModel.query().delete().where(data);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function addUser(data) {
  try {
    return await UserModel.query().insert(data).returning("*");
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getAllSavedMembersList(data) {
  try {
    const { user_id, role_id } = data;

    let queryBuilder = UserMemberModel.query()
      .where("user_id", user_id)
      .whereExists(
        UserModel.query()
          .where("users.id", UserMemberModel.raw("saved_members.member_id"))
          .andWhere("role_id", role_id)
      )
      .page(data.page, data.limit)
      .withGraphFetched("memberDetail");

    const resp: any = await queryBuilder;
    if (resp && resp.results.length > 0) {
      const transformedData = resp.results.map((item) => {
        item.savedByUser = true;
        delete item.password;
        const { memberDetail, ...rest } = item;
        return {
          ...rest,
          ...memberDetail,
        };
      });
      return { results: transformedData };
    } else {
      return { results: [] };
    }
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getAllSavedCompaniesList(data) {
  try {
    const { user_id, role_id } = data;
    let queryBuilder = UserMemberModel.query()
      .where("user_id", user_id)
      .whereExists(
        UserModel.query()
          .where("users.id", UserMemberModel.raw("saved_members.member_id"))
          .andWhere("role_id", role_id)
      )
      .page(data.page, data.limit)
      .withGraphFetched("companyDetail");

    const resp: any = await queryBuilder;
    if (resp && resp.results.length > 0) {
      const userIds = resp.results.map((user) => user.member_id);
      const opportunitiesCounts = await OpportunityModel.query()
        .select("created_by")
        .count("* as opportunitiesCount")
        .whereIn("created_by", userIds)
        .groupBy("created_by");

      const usersWithOpportunityCount = resp.results.map((user) => {
        const count: any = opportunitiesCounts.find(
          (count) => count.created_by === user.member_id
        );
        delete user.password;
        return {
          ...user,
          opportunitiesCount: count ? parseInt(count.opportunitiesCount) : 0,
        };
      });

      const transformedData = usersWithOpportunityCount.map((item) => {
        item.savedByUser = true;
        delete item.password;
        const { companyDetail, ...rest } = item;
        return {
          ...rest,
          ...companyDetail,
        };
      });

      return { results: transformedData };
    } else {
      return { results: [] };
    }
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getAllSavedEntityCounts(data) {
  try {
    const { user_id, company_role_id, member_role_id } = data;
    const knex = UserModel.knex();

    const query1 = `SELECT 'events' AS entity_type, COUNT(*) AS count FROM saved_events WHERE user_id = ?`;
    const query2 = `SELECT 'members' AS entity_type, COUNT(*) AS count FROM saved_members AS sm WHERE user_id = ?
    AND sm.member_id IN (SELECT id FROM users WHERE role_id = ${member_role_id})`;
    const query3 = `SELECT 'opportunities' AS entity_type, COUNT(*) AS count FROM saved_opportunities WHERE user_id = ?`;
    const query4 = `SELECT 'companies' AS entity_type, COUNT(*) AS count
    FROM saved_members AS sm
    WHERE user_id = ? AND sm.member_id IN (SELECT id FROM users WHERE role_id = ${company_role_id})`;
    const result1 = await knex.raw(query1, [user_id]);
    const result2 = await knex.raw(query2, [user_id]);
    const result3 = await knex.raw(query3, [user_id]);
    const result4 = await knex.raw(query4, [user_id]);
    const results = [result1.rows, result2.rows, result3.rows, result4.rows];
    return results;
  } catch (err) {
    throw new InternalError(err.toString());
  }
}
