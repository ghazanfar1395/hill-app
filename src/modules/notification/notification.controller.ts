import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import {
  checkUserNotificationsArrived,
  getNotificationsList,
  updateNotification,
} from "../../services/notification.services";
import {
  SuccessResponse,
  InternalErrorResponse,
} from "../../core/api-response";

export async function checkNewNotifications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const resp = await checkUserNotificationsArrived({ user_id: req.user.id });
    let newArrived = false;
    if (resp && resp.length > 0) {
      newArrived = true;
    }
    return new SuccessResponse("Operation successful!", {
      newArrived,
    }).send(res);
  } catch (err) {
    next(err);
  }
}

export async function notificationList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page = 0, limit = 10, is_read } = req.query;
    const resp = await getNotificationsList({
      user_id: req.user.id,
      is_read,
      page,
      limit,
    });

    return new SuccessResponse("Operation successful!", resp).send(res);
  } catch (err) {
    next(err);
  }
}

export async function patchNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { notification_id } = req.params;
    const { is_read } = req.body;
    const resp = await updateNotification(
      {
        is_read,
      },
      notification_id
    );

    return new SuccessResponse("Operation successful!", resp).send(res);
  } catch (err) {
    next(err);
  }
}
