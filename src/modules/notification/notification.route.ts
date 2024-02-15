import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  handleExpressValidation,
  authorizeRole,
} from "../../middlewares/common";
import {
  checkNewNotifications,
  notificationList,
  patchNotification,
} from "./notification.controller";
import passport from "passport";
import multer from "multer";
const router = Router();

router.get(
  "/list",
  query("is_read").isBoolean().optional(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  notificationList
);

router.patch(
  "/:notification_id",
  param("notification_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate", "company_admin"]),
  patchNotification
);

router.get(
  "/new-arrived",
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  checkNewNotifications
);

export default router;
