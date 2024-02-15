import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  handleExpressValidation,
  authorizeRole,
} from "../../middlewares/common";
import {
  createEvent,
  patchEvent,
  deleteEvent,
  listEvent,
  getEventById,
  rsvpEvent,
  handleUserEvent,
  getUserSavedEvent,
  getUserRsvpEvent,
} from "./event.controller";
import passport from "passport";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });

const router = Router();

router.post(
  "/",
  upload.single("event_image"),
  body("status").isString().optional().isIn(["draft", "published"]),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin"]),
  createEvent
);

router.post(
  "/rsvp",
  body("event_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate", "company_admin"]),
  rsvpEvent
);

router.get(
  "/",
  // passport.authenticate("jwt", { session: false }),
  // authorizeRole(["company_admin", "candidate"]),
  listEvent
);

router.get(
  "/:event_id",
  param("event_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  getEventById
);

router.patch(
  "/:event_id",
  upload.single("event_image"),
  param("event_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin"]),
  patchEvent
);

router.delete(
  "/:event_id",
  param("event_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin"]),
  deleteEvent
);

router.get(
  "/saved/list",
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  getUserSavedEvent
);

router.post(
  "/action/:action",
  param("action").isString().notEmpty().isIn(["unsave", "save"]),
  body("event_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  handleUserEvent
);

router.get(
  "/rsvp/list",
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  getUserRsvpEvent
);

export default router;
