import { Model } from "objection";

export default class UserSkillsModel extends Model {
  static tableName = "user_skills";

  id!: number;
  user_id: number;
  skill_id!: number;
  created_at!: Date;

  static get idColumn() {
    return ["id"];
  }

  $beforeInsert() {
    this.created_at = new Date();
  }
}
