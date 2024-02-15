import { Model, ModelObject } from "objection";
import path from "path";
export default class UserModel extends Model {
  static tableName = "users";

  id!: number;
  email: string;
  password: Text;
  created_at!: Date;
  updated_at!: Date;
  relocate!: boolean;
  role_id!: number;
  location!: string;
  password_reset_token!: string;
  password_salt!: string;
  company_name!: string;
  job_title!: string;
  social_media_link!: string;
  profile_image!: Text;
  skills!: string[];
  currently_studying!: boolean;
  created_by!: number;
  about!: Text;
  industry_id!: number;
  is_active!: boolean;
  industry!: string;
  full_name!: string;
  employee_count!: string;
  website_link!: string;
  video_url!: string;
  external_links!: string;
  showcase!: JSON;
  hq_address!: string;
  experience_level_id!: number;
  is_mailing_enabled!: boolean;
  headline!: Text;

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
      roleDetail: {
        relation: Model.HasOneRelation,
        modelClass: path.join(__dirname, "role.model"),
        join: {
          from: "users.role_id",
          to: "roles.id",
        },
      },
      educations: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "user_education.model"),
        join: {
          from: "users.id",
          to: "user_educations.user_id",
        },
      },
      experiences: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "user_experience.model"),
        join: {
          from: "users.id",
          to: "user_experiences.user_id",
        },
      },
      projects: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "project.model"),
        join: {
          from: "users.id",
          to: "projects.created_by",
        },
      },
      events: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "event.model"),
        join: {
          from: "users.id",
          to: "events.created_by",
        },
      },
      opportunities: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, "opportunity.model"),
        join: {
          from: "users.id",
          to: "opportunities.created_by",
        },
      },
      savedByUser: {
        relation: Model.HasOneRelation,
        modelClass: path.join(__dirname, "saved_members.model"),
        join: {
          from: "users.id",
          to: "saved_members.member_id",
        },
        modify: (query) => {
          query.where("user_id", query.context().dataUserId);
        },
      },
    };
  }
}
