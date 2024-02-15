import { Model, ModelObject } from "objection";
import path from "path";

enum EventStatus {
  Draft = "draft",
  Published = "published",
}
export default class EventModel extends Model {
  static tableName = "events";

  id!: number;
  event_name!: string;
  event_location: string;
  created_at!: Date;
  updated_at!: Date;
  start_date!: Date;
  end_date!: Date;
  start_time!: string;
  end_time!: string;
  hashtags!: string[];
  event_url!: Text;
  event_image_link!: Text;
  created_by!: number;
  event_description!: Text;
  event_type!: string;
  status!: EventStatus;
  timezone!: string;
  rsvp_availability_count!: number;
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
      // rsvps: {
      //   relation: Model.HasManyRelation,
      //   modelClass: path.join(__dirname, "rsvp_event.model"),
      //   join: {
      //     from: "events.id", // The column in events table
      //     to: "rsvp_events.event_id", // The column in rsvp_events table
      //   },
      // },
      createdByDetail: {
        relation: Model.HasOneRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "events.created_by",
          to: "users.id",
        },
      },
      rsvps: {
        relation: Model.ManyToManyRelation,
        modelClass: path.join(__dirname, "user.model"),
        join: {
          from: "events.id",
          through: {
            from: "rsvp_events.event_id",
            to: "rsvp_events.user_id",
          },
          to: "users.id",
        },
      },
      savedByUser: {
        relation: Model.HasOneRelation,
        modelClass: path.join(__dirname, "saved_events.model"),
        join: {
          from: "events.id",
          to: "saved_events.event_id",
        },
        modify: (query) => {
          query.where("user_id", query.context().dataUserId);
        },
      },
    };
  }
}
