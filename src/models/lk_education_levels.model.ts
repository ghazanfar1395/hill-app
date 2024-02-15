import { Model } from "objection";

export default class LKIndustryModel extends Model {
  static tableName = "lk_education_levels";

  id: number;
  level_name: string;

  static get idColumn() {
    return ["id"];
  }
}
