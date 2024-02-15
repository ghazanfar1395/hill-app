import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import { saveCompany } from "../../services/company.services";
import {
  SuccessResponse,
  InternalErrorResponse,
} from "../../core/api-response";
import UserModel from "../../models/user.model";
import RoleModel from "../../models/role.model";
import { generateSalt, hashPassword, isPasswordValid } from "../../libs/common";
import { createCompanyTemplate } from "../../libs/email-templates";
import { sendEmailViaNodeMailer } from "../../utils/email";

export async function verifyCompany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const roleDetail = await RoleModel.getRoleDetailByName("company_admin");
    if (!roleDetail) {
      return new InternalErrorResponse("Role not Exist").send(res);
    }

    const companyExist = await UserModel.query().findOne({
      email: email,
      role_id: roleDetail.id,
    });

    if (!companyExist) {
      return new InternalErrorResponse("No Company Exist").send(res);
    }

    const salt = generateSalt(16);
    const encryptedPass = hashPassword(password, salt);
    await UserModel.query()
      .update({ password: encryptedPass, password_salt: salt })
      .where("id", companyExist.id);
    return new SuccessResponse("Password updated!", {}).send(res);
  } catch (err) {
    next(err);
  }
}
