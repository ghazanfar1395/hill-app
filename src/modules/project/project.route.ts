import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  handleExpressValidation,
  authorizeRole,
} from "../../middlewares/common";
import {
  createProject,
  getProjects,
  deleteProject,
} from "./project.controller";
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
  upload.single("cover_image"),
  body("project_title").isString().notEmpty(),
  body("project_summary").isString().optional(),
  body("project_description").isString().optional(),
  body("industry_id").isNumeric().optional(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  createProject
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  getProjects
);

router.get(
  "/:project_id",
  param("project_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  getProjects
);

router.delete(
  "/:project_id",
  param("project_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  deleteProject
);

router.patch(
  "/:project_id",
  upload.single("cover_image"),
  body("project_title").isString().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  createProject
);

export default router;
