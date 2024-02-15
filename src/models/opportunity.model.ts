import { Model, ModelObject } from "objection";
import path from "path";

enum OpportunityStatus {
  Draft = "draft",
  Published = "published",
}
export default class OpportunityModel extends Model {
  static tableName = "opportunities";

  id!: number;
  created_at!: Date;
  updated_at!: Date;
  hashtags!: string[];
  image_path!: string;
  description!: Text;
  opportunity_role!: string;
  requirements!: Text[];
  estimated_salary!: number;
  is_hourly!: boolean;
  is_active!: boolean;
  apply_link!: Text;
  hourly_pay!: string;
  expires_at!: Date;
  created_by!: number;
  opportunity_location!: string;
  status!: OpportunityStatus;
  currency!: string;
  is_volunteer!: boolean;

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
    createdByDetail: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "user.model"),
      join: {
        from: "users.id",
        to: "opportunities.created_by",
      },
    },
    savedByUser: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "saved_opportunity.model"),
      join: {
        from: "opportunities.id",
        to: "saved_opportunities.opportunity_id",
      },
      modify: (query) => {
        query.where("user_id", query.context().dataUserId);
      },
    },
  };
}
