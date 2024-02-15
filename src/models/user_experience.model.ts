import { Model } from "objection";
import path from "path";

export default class UserExperienceModel extends Model {
  static tableName = "user_experiences";

  id: number;
  user_id: number;
  job_title!: string;
  created_at!: Date;
  updated_at!: Date;
  company_name!: string;
  is_current_job!: boolean;
  start_date!: Date;
  end_date!: Date;
  description!: Text;
  is_remote!: boolean;
  is_full_time!: boolean;
  is_part_time!: boolean;
  is_contract!: boolean;
  location!: string;
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
