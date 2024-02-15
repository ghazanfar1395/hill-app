import OpportunityModel from "../models/opportunity.model";
import SavedOpportunityModel from "../models/saved_opportunity.model";
import LikedOpportunityModel from "../models/liked_opportunity.model";
import NotificationModel from "../models/notifications.model";

import { InternalError } from "../core/api-error";

export async function saveOpportunity(data) {
  try {
    return await OpportunityModel.query().insert(data).returning("*");
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function unSaveUserOpportunity(data) {
  try {
    return await SavedOpportunityModel.query().delete().where(data);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getSingleOpportunity(opportunityId) {
  try {
    return await OpportunityModel.query().findOne({
      id: opportunityId,
    });
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getOpportunityByUserId(opportunityId, userId) {
  try {
    let queryBuilder = OpportunityModel.query()
      .findOne({
        id: opportunityId,
      })
      .withGraphFetched("createdByDetail")
      .modifyGraph("createdByDetail", (builder) => {
        builder.select(
          "id",
          "full_name",
          "email",
          "company_name",
          "location",
          "profile_image"
        );
      });

    queryBuilder = queryBuilder
      .context({ dataUserId: userId })
      .withGraphFetched("savedByUser");
    return await queryBuilder;
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function updateOpportunity(data, opportunityId, createdBy) {
  try {
    return await OpportunityModel.query()
      .update(data)
      .where("id", opportunityId)
      .andWhere("created_by", createdBy)
      .returning("*");
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function removeOpportunity(opportunityId, createdBy) {
  try {
    await OpportunityModel.query()
      .delete()
      .where("id", opportunityId)
      .andWhere("created_by", createdBy)
      .returning("*");
    // remove all dependencies
    await SavedOpportunityModel.query()
      .delete()
      .where("opportunity_id", opportunityId);
    return await LikedOpportunityModel.query()
      .delete()
      .where("opportunity_id", opportunityId);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function saveUserOpportunity(data) {
  try {
    const opportunityData = {
      user_id: data.user_id,
      opportunity_id: data.opportunity_id,
    };

    const opportunity = await SavedOpportunityModel.query().findOne(
      opportunityData
    );
    if (opportunity) {
      return opportunity;
    }

    return await SavedOpportunityModel.query().insert(opportunityData);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function likeUserOpportunity(data) {
  try {
    const opportunityData = {
      user_id: data.user_id,
      opportunity_id: data.opportunity_id,
    };

    const opportunity = await LikedOpportunityModel.query().findOne(
      opportunityData
    );
    if (opportunity) {
      return opportunity;
    }

    return await LikedOpportunityModel.query().insert(opportunityData);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getOpportunityList(data) {
  try {
    let findClause = {};
    const currentTime = new Date();
    if (data.user_id) {
      findClause["created_by"] = data.user_id;
    } else {
      findClause["is_active"] = true;
    }

    let queryBuilder = OpportunityModel.query().where(findClause);

    // checking for draft and published cases
    if (data.status && data.status === "draft") {
      queryBuilder = queryBuilder.andWhere("status", "draft");
    } else if (data.status && data.status === "all") {
      // Include expiration check only for "published" opportunities
      queryBuilder = queryBuilder
        .andWhere(function () {
          this.where("status", "published").andWhere(
            "expires_at",
            ">",
            currentTime
          );
        })
        .orWhere("status", "draft");
    } else {
      queryBuilder = queryBuilder.andWhere("status", "published");
      queryBuilder = queryBuilder.andWhere("expires_at", ">", currentTime);
    }

    if (data.opportunity_role) {
      queryBuilder = queryBuilder.andWhereRaw(
        'LOWER("opportunity_role") like ?',
        [`%${data.opportunity_role.toLowerCase()}%`]
      );
    }

    let queryBuilderIns = queryBuilder
      .withGraphFetched("createdByDetail")
      .modifyGraph("createdByDetail", (builder) => {
        builder.select(
          "id",
          "full_name",
          "email",
          "company_name",
          "location",
          "profile_image"
        );
      })
      .orderBy("id", "desc")
      .page(data.page, data.limit);

    if (data.loggedInUserId) {
      queryBuilder = queryBuilder
        .context({ dataUserId: data.loggedInUserId })
        .withGraphFetched("savedByUser");
    }

    return await queryBuilderIns;
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

// export async function getSavedOpportunities(data) {
//   try {
//     let findClause = { user_id: data.user_id };

//     let queryBuilder = SavedOpportunityModel.query()
//       .where(findClause)
//       .withGraphFetched("opportunityDetail")
//       .page(data.page, data.limit);
//     const resp: any = await queryBuilder;

//     if (resp && resp.results.length > 0) {
//       const createdByDetailData = await SavedOpportunityModel.query()
//         .select("users.*")
//         .join(
//           "opportunities",
//           "saved_opportunities.opportunity_id",
//           "opportunities.id"
//         )
//         .join("users", "opportunities.created_by", "users.id")
//         .where(findClause)
//         .page(data.page, data.limit);

//       const transformedData = resp.results.map((opportunity: any) => {
//         opportunity.savedByUser = true;
//         const createdByDetail = createdByDetailData.results.find(
//           (user) => user.id === opportunity.opportunityDetail.created_by
//         );
//         return {
//           ...opportunity,
//           createdByDetail,
//         };
//       });
//       return { results: transformedData };
//     } else {
//       return { results: [] };
//     }
//   } catch (err) {
//     throw new InternalError(err.toString());
//   }
// }

export async function getSavedOpportunities(data) {
  try {
    const currentTime = new Date();
    let findClause = { user_id: data.user_id };
    const resp: any = await SavedOpportunityModel.query()
      .where(findClause)
      .withGraphFetched("opportunityDetail")
      .join(
        "opportunities",
        "saved_opportunities.opportunity_id",
        "opportunities.id"
      )
      .where("opportunities.is_active", true)
      .where("opportunities.expires_at", ">", currentTime)
      .page(data.page, data.limit);

    if (resp && resp.results.length > 0) {
      const createdByDetailData = await SavedOpportunityModel.query()
        .select("users.*")
        .join(
          "opportunities",
          "saved_opportunities.opportunity_id",
          "opportunities.id"
        )
        .join("users", "opportunities.created_by", "users.id")
        .where(findClause)
        .page(data.page, data.limit);

      const transformedData = resp.results.map((opportunity: any) => {
        opportunity.savedByUser = true;
        const createdByDetail = createdByDetailData.results.find(
          (user) => user.id === opportunity.opportunityDetail.created_by
        );

        const opportunityData = {
          ...opportunity,
          ...opportunity.opportunityDetail,
          createdByDetail,
        };
        delete opportunityData.opportunityDetail;
        return opportunityData;
      });
      return { results: transformedData, total: resp.total || 0 };
    } else {
      return { results: [] };
    }
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getLikedOpportunities(data) {
  try {
    let findClause = { user_id: data.user_id };
    const currentTime = new Date();
    let queryBuilder = LikedOpportunityModel.query()
      .where(findClause)
      .withGraphFetched("opportunityDetail")
      .join(
        "opportunities",
        "liked_opportunities.opportunity_id",
        "opportunities.id"
      )
      .where("opportunities.is_active", true)
      .where("opportunities.expires_at", ">", currentTime)
      .page(data.page, data.limit);

    queryBuilder = queryBuilder
      .context({ dataUserId: data.user_id })
      .withGraphFetched("savedByUser");
    const resp: any = await queryBuilder;

    if (resp && resp.results.length > 0) {
      const createdByDetailData = await LikedOpportunityModel.query()
        .select("users.*")
        .join(
          "opportunities",
          "liked_opportunities.opportunity_id",
          "opportunities.id"
        )
        .join("users", "opportunities.created_by", "users.id")
        .where(findClause)
        .page(data.page, data.limit);

      const transformedData = resp.results.map((opportunity: any) => {
        const createdByDetail = createdByDetailData.results.find(
          (user) => user.id === opportunity.opportunityDetail.created_by
        );

        // Create a new object with opportunityDetail fields moved to root
        const opportunityData = {
          ...opportunity,
          ...opportunity.opportunityDetail,
          createdByDetail,
        };
        delete opportunityData.opportunityDetail;
        return opportunityData;
      });
      return { results: transformedData };
    } else {
      return { results: [] };
    }
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function inviteUserOpportunity(data) {
  try {
    const { user_ids, created_by, opportunity_id } = data;

    // Create notification records for each user
    const notifications = user_ids.map((to_id) => {
      return NotificationModel.query().insert({
        notification_type: "INVITE_OPPORTUNITY", // Adjust the type as needed
        to_id,
        module: "OPPORTUNITY",
        module_id: opportunity_id,
        description: "",
        created_by,
      });
    });
    await Promise.all(notifications);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}
