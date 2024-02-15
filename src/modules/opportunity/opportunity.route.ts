import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  handleExpressValidation,
  authorizeRole,
} from "../../middlewares/common";
import {
  createOpportunity,
  handleActionOpportunity,
  getSaveOpportunity,
  patchOpportunity,
  deleteOpportunity,
  listOpportunity,
  getOpportunity,
  LikeOpportunity,
  inviteUserForOpportunity,
  getLikedOpportunity,
} from "./opportunity.controller";
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

router.get(
  "/saved-opportunities",
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  getSaveOpportunity
);

router.get(
  "/liked-opportunities",
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  getLikedOpportunity
);

router.post(
  "/",
  upload.single("opportunity_image"),
  body("status").isString().optional().isIn(["draft", "published"]),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin"]),
  createOpportunity
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  listOpportunity
);

router.get(
  "/:opportunity_id",
  param("opportunity_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  getOpportunity
);

router.post(
  "/action/:action",
  param("action").isString().notEmpty().isIn(["unsave", "save"]),
  body("opportunity_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin", "candidate"]),
  handleActionOpportunity
);

router.patch(
  "/:opportunity_id",
  upload.single("opportunity_image"),
  param("opportunity_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin"]),
  patchOpportunity
);

router.delete(
  "/:opportunity_id",
  param("opportunity_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["company_admin"]),
  deleteOpportunity
);

router.post(
  "/like-opportunity",
  body("opportunity_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate", "company_admin"]),
  LikeOpportunity
);

router.post(
  "/invite-users",
  body("user_ids").isArray().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate", "company_admin"]),
  inviteUserForOpportunity
);

export default router;
