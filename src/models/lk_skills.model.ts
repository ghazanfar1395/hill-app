import { Model } from "objection";

export default class LKSkillModel extends Model {
  static tableName = "lk_skills";

  id!: number;
  skill_name!: string;

  static get idColumn() {
    return ["id"];
  }
}
