import EventModel from "../models/event.model";
import RsvpEventModel from "../models/rsvp_event.model";
import SavedEventModel from "../models/saved_events.model";
import { InternalError } from "../core/api-error";
import UserModel from "../models/user.model";
import { getIcalObjectInstance } from "../libs/common";
import { writeFile } from "fs/promises";
import { sendEventCalendarEmail } from "../utils/email";

export async function saveEvent(data) {
  try {
    return await EventModel.query().insert(data).returning("*");
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getSingleEvent(eventId) {
  try {
    return await EventModel.query()
      .findOne({
        id: eventId,
      })
      .withGraphFetched("rsvps") // Fetch RSVP users
      .modifyGraph("rsvps", (builder) => {
        builder.select(
          "profile_image",
          "full_name",
          "job_title",
          "location",
          "email",
          "user_id"
        ); // Select specific fields
      });
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getEventDetailByUserId(eventId, userId) {
  try {
    let queryBuilder = EventModel.query().findOne({
      id: eventId,
    });
    queryBuilder = queryBuilder
      .withGraphFetched("rsvps")
      .modifyGraph("rsvps", (builder) => {
        builder.select(
          "profile_image",
          "full_name",
          "job_title",
          "location",
          "email",
          "user_id"
        );
      });
    queryBuilder = queryBuilder
      .withGraphFetched("createdByDetail")
      .modifyGraph("createdByDetail", (builder) => {
        builder.select("company_name", "id");
      });

    queryBuilder = queryBuilder
      .context({ dataUserId: userId })
      .withGraphFetched("savedByUser");

    return await queryBuilder;
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function updateEvent(data, eventId, createdBy) {
  try {
    return await EventModel.query()
      .update(data)
      .where("id", eventId)
      .andWhere("created_by", createdBy)
      .returning("*");
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function removeEvent(eventId, createdBy) {
  try {
    await EventModel.query()
      .delete()
      .where("id", eventId)
      .andWhere("created_by", createdBy)
      .returning("*");
    // remove all dependencies
    await RsvpEventModel.query().delete().where("event_id", eventId);
    return await SavedEventModel.query().delete().where("event_id", eventId);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

// export async function getEventList(data) {
//   try {
//     const findClause = {};

//     if (data.user_id) {
//       findClause["created_by"] = data.user_id;
//     }
//     return await EventModel.query()
//       .where(findClause)
//       .page(data.page, data.limit)
//       .context({ dataUserId: data.user_id })
//       .withGraphFetched("savedByUser");
//   } catch (err) {
//     throw new InternalError(err.toString());
//   }
// }
export async function getEventList(data) {
  try {
    const findClause = {};

    if (!data.saved && data.user_id) {
      findClause["created_by"] = data.user_id;
    }

    let queryBuilder = EventModel.query().where(findClause);

    if (data.status && data.status === "draft") {
      queryBuilder = queryBuilder.andWhere("status", "draft");
    } else if (data.status && data.status === "all") {
      queryBuilder = queryBuilder.andWhere("status", "in", [
        "draft",
        "published",
      ]);
    } else {
      queryBuilder = queryBuilder.andWhere("status", "published");
    }

    if (data.event_name) {
      queryBuilder = queryBuilder.andWhereRaw('LOWER("event_name") like ?', [
        `%${data.event_name.toLowerCase()}%`,
      ]);
    }

    let queryBuilderFinal = queryBuilder
      .page(data.page, data.limit)
      .orderBy("id", "desc");

    if (data.saved && data.user_id) {
      // Set the user_id as a context value
      queryBuilder = queryBuilder
        .context({ dataUserId: data.user_id })
        .withGraphFetched("savedByUser");
    }

    const events = await queryBuilderFinal;
    return events;
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function setRsvpEvent(eventId, userId) {
  try {
    const existingRecord = await RsvpEventModel.query().findOne({
      event_id: eventId,
      user_id: userId,
    });

    if (!existingRecord) {
      return await RsvpEventModel.query().insert({
        event_id: eventId,
        user_id: userId,
      });
    }
    return existingRecord;
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function sendCalendarInvite(eventDetails, userId) {
  try {
    const userDetail = await UserModel.query().findOne({ id: userId });
    const organizerDetail = await UserModel.query().findOne({
      id: eventDetails.created_by,
    });

    const icalObject = await getIcalObjectInstance(
      eventDetails.start_date,
      eventDetails.end_date,
      eventDetails.event_name,
      eventDetails.event_description,
      eventDetails.event_location,
      eventDetails.event_url,
      organizerDetail.full_name || "",
      organizerDetail.email || ""
    );
    // now lets save this formatted string in file
    const icalContent = icalObject.toString();
    await writeFile(`public/${eventDetails.id}.ics`, icalContent);
    await sendEventCalendarEmail({
      subscriberDetail: userDetail,
      eventDetail: eventDetails,
    });

    return true;
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function addUserSavedEvent(data) {
  try {
    const eventData = {
      user_id: data.user_id,
      event_id: data.event_id,
    };

    const event = await SavedEventModel.query().findOne(eventData);
    if (event) {
      return event;
    }

    return await SavedEventModel.query().insert(eventData);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function deleteUserSavedEvent(data) {
  try {
    const eventData = {
      user_id: data.user_id,
      event_id: data.event_id,
    };
    return await SavedEventModel.query().delete().where(eventData);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getUserSavedEventList(data) {
  try {
    const resp: any = await SavedEventModel.query()
      .where("user_id", data.user_id)
      .withGraphFetched("eventDetail")
      .page(data.page, data.limit);

    if (resp && resp.results.length > 0) {
      const transformedData = resp.results.map((item) => {
        item.savedByUser = true;
        const { eventDetail, ...rest } = item;
        return {
          ...rest,
          ...eventDetail,
        };
      });
      return { results: transformedData };
    } else {
      return { results: [] };
    }
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getUserRsvpEventList(data) {
  try {
    let queryBuilder = RsvpEventModel.query()
      .where({
        user_id: data.user_id,
      })
      .withGraphFetched("eventDetail")
      .page(data.page, data.limit);

    queryBuilder = queryBuilder
      .context({ dataUserId: data.user_id })
      .withGraphFetched("savedByUser");

    const resp: any = await queryBuilder;
    if (resp && resp.results.length > 0) {
      const transformedData = resp.results.map((item) => {
        const { eventDetail, ...rest } = item;
        return {
          ...rest,
          ...eventDetail,
        };
      });
      return transformedData;
    } else {
      return { results: [] };
    }
  } catch (err) {
    throw new InternalError(err.toString());
  }
}
