import { Model, ModelObject } from "objection";
import path from "path";

export default class LikedOpportunityModel extends Model {
  static tableName = "liked_opportunities";

  id!: number;
  opportunity_id!: number;
  user_id!: number;
  created_at!: Date;
  updated_at!: Date;

  static get idColumn() {
    return ["id"];
  }

  $beforeInsert() {
    this.created_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }

  static relationMappings = {
    opportunityDetail: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "opportunity.model"),
      join: {
        from: "liked_opportunities.opportunity_id",
        to: "opportunities.id",
      },
    },
    // createdByDetail: {
    //   relation: Model.HasOneRelation,
    //   modelClass: path.join(__dirname, "user.model"),
    //   join: {
    //     from: "liked_opportunities.user_id",
    //     to: "users.id",
    //   },
    // },
    createdByDetail: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "user.model"),
      join: {
        from: "liked_opportunities.opportunity_id",
        through: {
          from: "opportunities.id",
          to: "opportunities.created_by",
        },
        to: "users.id",
      },
    },
    savedByUser: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "saved_opportunity.model"),
      join: {
        from: "liked_opportunities.opportunity_id",
        to: "saved_opportunities.opportunity_id",
      },
      modify: (query) => {
        query.where("user_id", query.context().dataUserId);
      },
    },
  };
}
