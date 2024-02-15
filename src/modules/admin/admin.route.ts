import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  handleExpressValidation,
  authorizeRole,
} from "../../middlewares/common";
import { createCompany } from "./admin.controller";
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
  "/create-company",
  body("email").isEmail().notEmpty(),
  body("company_name").isString().notEmpty(),
  body("full_name").isString().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["admin", "candidate", "company_admin"]),
  createCompany
);

export default router;
