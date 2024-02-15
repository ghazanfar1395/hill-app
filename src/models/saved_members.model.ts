import { Model, ModelObject } from "objection";
import path from "path";

export default class SavedMembersModel extends Model {
  static tableName = "saved_members";

  id!: number;
  member_id!: number;
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
    memberDetail: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "user.model"),
      join: {
        from: "saved_members.member_id",
        to: "users.id",
      },
    },
    companyDetail: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "user.model"),
      join: {
        from: "saved_members.member_id",
        to: "users.id",
      },
    },
  };
}
