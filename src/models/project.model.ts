import { Model, ModelObject } from "objection";
import path from "path";
export default class UserModel extends Model {
  static tableName = "projects";

  id!: number;
  project_title!: string;
  project_summary!: Text;
  cover_image_link: Text;
  created_at!: Date;
  updated_at!: Date;
  created_by: number;
  start_date!: Date;
  end_date!: Date;
  project_url!: string;

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
    industryDetail: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "lk_industry.model"),
      join: {
        from: "lk_industries.id",
        to: "projects.industry_id",
      },
    },
  };
}
