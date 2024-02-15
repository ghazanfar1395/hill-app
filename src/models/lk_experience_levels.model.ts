import { Model } from "objection";

export default class LKExperienceModel extends Model {
  static tableName = "lk_experience_levels";

  id: number;
  level_name: string;

  static get idColumn() {
    return ["id"];
  }
}
