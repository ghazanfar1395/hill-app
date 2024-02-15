import { Model, ModelObject } from "objection";
import path from "path";

export default class RsvpEventModel extends Model {
  static tableName = "rsvp_events";

  id!: number;
  event_id!: number;
  user_id!: number;
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
        from: "rsvp_events.event_id",
        to: "events.id",
      },
    },
    savedByUser: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, "saved_events.model"),
      join: {
        from: "rsvp_events.event_id",
        to: "saved_events.event_id",
      },
      modify: (query) => {
        query.where("user_id", query.context().dataUserId);
      },
    },
  };
}
