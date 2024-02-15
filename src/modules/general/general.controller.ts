import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import { saveOpportunity } from "../../services/opportunity.services";
import { SuccessResponse } from "../../core/api-response";

export async function getLookupData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { table_name } = req.params;
    let model;
    if (table_name === "lk_industries") {
      model = require("../../models/lk_industry.model").default;
    }
    if (table_name === "lk_skills") {
      model = require("../../models/lk_skills.model").default;
    }
    if (table_name === "lk_education_levels") {
      model = require("../../models/lk_education_levels.model").default;
    }
    if (table_name === "lk_experience_levels") {
      model = require("../../models/lk_experience_levels.model").default;
    }

    const result = await model.query();
    return new SuccessResponse("Opportunity saved successfully!", result).send(
      res
    );
  } catch (err) {
    next(err);
  }
}
