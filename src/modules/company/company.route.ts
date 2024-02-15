import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  handleExpressValidation,
  authorizeRole,
} from "../../middlewares/common";
import { verifyCompany } from "./company.controller";
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
  "/update-password",
  body("email").isEmail().notEmpty(),
  body("password").isString().notEmpty(),
  handleExpressValidation,
  verifyCompany
);

export default router;
