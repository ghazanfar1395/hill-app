import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import {
  saveEvent,
  getSingleEvent,
  updateEvent,
  removeEvent,
  getEventList,
  setRsvpEvent,
  addUserSavedEvent,
  getUserSavedEventList,
  getUserRsvpEventList,
  deleteUserSavedEvent,
  getEventDetailByUserId,
  sendCalendarInvite,
} from "../../services/event.services";
import {
  SuccessResponse,
  InternalErrorResponse,
} from "../../core/api-response";
import { uploadFile } from "../../libs/common";

export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let payload = req.body;
    if (req.file && req.file.filename) {
      const uploadRes = await uploadFile("hill-app/events", req.file.filename);
      if (uploadRes && uploadRes.s3Link) {
        payload.event_image_link = uploadRes.s3Link;
      }
      fs.unlinkSync(`public/${req.file.filename}`);
    }

    if (payload.hashtags && typeof payload.hashtags === "string") {
      if (payload.hashtags.trim() === "") {
        payload.hashtags = [];
      } else {
        // Split the non-empty string into an array
        payload.hashtags = payload.hashtags.split(",").map((t) => t.trim());
      }
    }
    payload.created_by = req.user.id;
    const resp = await saveEvent(payload);

    return new SuccessResponse("Event saved successfully!", resp).send(res);
  } catch (err) {
    next(err);
  }
}

export async function patchEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { event_id } = req.params;
    const event = await getSingleEvent(event_id);
    if (!event) {
      return new InternalErrorResponse("Event not found!").send(res);
    }

    let payload = req.body;
    if (req.file && req.file.filename) {
      const uploadRes = await uploadFile("hill-app/events", req.file.filename);
      if (uploadRes && uploadRes.s3Link) {
        payload.event_image_link = uploadRes.s3Link;
      }
      fs.unlinkSync(`public/${req.file.filename}`);
    }

    if (payload.hashtags && typeof payload.hashtags === "string") {
      if (payload.hashtags.trim() === "") {
        payload.hashtags = [];
      } else {
        payload.hashtags = payload.hashtags.split(",").map((t) => t.trim());
      }
    }

    const resp = await updateEvent(payload, event_id, req.user.id);

    return new SuccessResponse("Event updated successfully!", resp).send(res);
  } catch (err) {
    next(err);
  }
}

export async function deleteEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { event_id } = req.params;

    const event = await getSingleEvent(event_id);
    if (!event) {
      return new InternalErrorResponse("Event not found!").send(res);
    }

    const resp = await removeEvent(event_id, req.user.id);
    return new SuccessResponse("Event deleted successfully!", resp).send(res);
  } catch (err) {
    next(err);
  }
}

export async function listEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      page = 0,
      limit = 10,
      user_id,
      saved,
      status,
      event_name,
    } = req.query;

    const resp = await getEventList({
      saved,
      user_id,
      page,
      limit,
      status,
      event_name,
    });
    return new SuccessResponse("Event listed successfully!", resp).send(res);
  } catch (err) {
    next(err);
  }
}

export async function getEventById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { event_id } = req.params;

    const event = await getEventDetailByUserId(event_id, req.user.id);
    if (!event) {
      return new InternalErrorResponse("Event not found!").send(res);
    }

    return new SuccessResponse("Event retrieved successfully!", event).send(
      res
    );
  } catch (err) {
    next(err);
  }
}

export async function rsvpEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { event_id } = req.body;

    const event = await getSingleEvent(event_id);
    if (!event) {
      return new InternalErrorResponse("Event not found!").send(res);
    }
    await setRsvpEvent(event_id, req.user.id);
    sendCalendarInvite(event, req.user.id);
    return new SuccessResponse("Event responded successfully!", event).send(
      res
    );
  } catch (err) {
    next(err);
  }
}

export async function handleUserEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { event_id } = req.body;
    const { action } = req.params;
    const event = await getSingleEvent(event_id);
    if (!event) {
      return new InternalErrorResponse("Event not found!").send(res);
    }
    if (action === "unsave") {
      await deleteUserSavedEvent({ event_id, user_id: req.user.id });
    } else if (action === "save") {
      await addUserSavedEvent({ event_id, user_id: req.user.id });
    } else {
      return new InternalErrorResponse("Invalid action!").send(res);
    }

    return new SuccessResponse(`Event ${action}d successfully!`, {}).send(res);
  } catch (err) {
    next(err);
  }
}

export async function getUserSavedEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page = 0, limit = 10 } = req.query;

    const resp = await getUserSavedEventList({
      user_id: req.user.id,
      page,
      limit,
    });
    return new SuccessResponse("Saved events listed successfully!", resp).send(
      res
    );
  } catch (err) {
    next(err);
  }
}

export async function getUserRsvpEvent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page = 0, limit = 10 } = req.query;

    const resp = await getUserRsvpEventList({
      user_id: req.user.id,
      page,
      limit,
    });
    return new SuccessResponse("Saved events listed successfully!", resp).send(
      res
    );
  } catch (err) {
    next(err);
  }
}
