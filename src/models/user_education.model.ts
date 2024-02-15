import { Model } from "objection";
import path from "path";

export default class UserEducationModel extends Model {
  static tableName = "user_educations";

  id: number;
  user_id: number;
  institution_name!: string;
  created_at!: Date;
  updated_at!: Date;
  start_date!: Date;
  end_date!: Date;
  is_current_studying!: boolean;
  description!: Text;
  education_level_id!: number;
  subject_name!: string;

  static get idColumn() {
    return ["id"];
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }

  $beforeInsert() {
    this.created_at = new Date();
  }
}
