import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  handleExpressValidation,
  authorizeRole,
} from "../../middlewares/common";
import { getLookupData } from "./general.controller";
import passport from "passport";

const router = Router();

router.get(
  "/lookup/:table_name",
  param("table_name")
    .isString()
    .isIn(["lk_industries", "lk_skills", "lk_education_levels", "lk_experience_levels"]),
  handleExpressValidation,
  getLookupData
);

export default router;
