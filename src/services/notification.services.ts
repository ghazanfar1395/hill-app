import NotificationModel from "../models/notifications.model";

import { InternalError } from "../core/api-error";

export async function checkUserNotificationsArrived(data) {
  try {
    let findClause = { is_read: false };
    if (data.user_id) {
      findClause["to_id"] = data.user_id;
    }
    return await NotificationModel.query().where(findClause).limit(5);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getNotificationsList(data) {
  try {
    let findClause = { to_id: data.user_id };
    if (data.is_read) {
      findClause["is_read"] = data.is_read;
    }
    return await NotificationModel.query()
      .where(findClause)
      .orderBy("created_at", "desc")
      .withGraphFetched("createdByDetail")
      .modifyGraph("createdByDetail", (builder) => {
        builder.select(
          "id",
          "full_name",
          "email",
          "company_name",
          "location",
          "profile_image"
        );
      })
      .withGraphFetched("opportunityDetail")
      .modifyGraph("opportunityDetail", (builder) => {
        builder.select("id", "opportunity_role");
      })
      .page(data.page, data.limit);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function updateNotification(data, notificationId) {
  try {
    return await NotificationModel.query()
      .update(data)
      .where("id", notificationId)
      .returning("*");
  } catch (err) {
    throw new InternalError(err.toString());
  }
}
