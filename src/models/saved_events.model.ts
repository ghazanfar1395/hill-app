import { Model, ModelObject } from "objection";
import path from "path";

export default class SavedEventModel extends Model {
  static tableName = "saved_events";

  id!: number;
  event_id: number;
  user_id: number;
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
    eventDetail: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "event.model"),
      join: {
        from: "saved_events.event_id",
        to: "events.id",
      },
    },
  };
}
