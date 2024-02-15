import { Model, ModelObject } from "objection";
import path from "path";
export default class EventModel extends Model {
  static tableName = "notifications";

  id!: number;
  notification_type!: string;
  to_id: number;
  created_at!: Date;
  updated_at!: Date;
  module!: string;
  module_id!: number;
  description!: string;
  created_by!: number;

  static get idColumn() {
    return ["id"];
  }

  $beforeInsert() {
    this.created_at = new Date();
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
  static get relationMappings() {
    return {
      createdByDetail: {
        relation: Model.HasOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "notifications.created_by",
          to: "users.id",
        },
      },
      opportunityDetail: {
        relation: Model.HasOneRelation,
        modelClass: path.join(__dirname, "opportunity.model"),
        join: {
          from: "notifications.module_id",
          to: "opportunities.id",
        },
      },
    };
  }
}
