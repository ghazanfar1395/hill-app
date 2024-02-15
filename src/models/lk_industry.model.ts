import { Model } from "objection";

export default class LKIndustryModel extends Model {
  static tableName = "lk_industries";

  id!: number;
  industry_name!: string;
  created_at!: Date;

  static get idColumn() {
    return ["id"];
  }

  $beforeInsert() {
    this.created_at = new Date();
  }
}
