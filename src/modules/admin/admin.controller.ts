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
import {
  generateSalt,
  hashPassword,
  generateRandomPassword,
} from "../../libs/common";
import { createCompanyTemplate } from "../../libs/email-templates";
import { sendEmailViaNodeMailer } from "../../utils/email";

export async function createCompany(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, full_name } = req.body;
    const password = generateRandomPassword(8);
    let payload: any = req.body;
    payload.password = password;
    const userData = await UserModel.query().where("email", email);
    if (userData.length > 0) {
      return new InternalErrorResponse("Email Already Exist").send(res);
    }

    const roleDetail = await RoleModel.getRoleDetailByName("company_admin");

    if (!roleDetail) {
      return new InternalErrorResponse("Role not Exist").send(res);
    }

    const createCompanyTemp = createCompanyTemplate(payload);
    await sendEmailViaNodeMailer({
      template: createCompanyTemp,
      subject: "Company Created Successfully",
      email: email,
    });
    const salt = generateSalt(16);
    const encryptedPass = hashPassword(password, salt);
    payload.password_salt = salt;
    payload.password = encryptedPass;
    payload.role_id = roleDetail.id;
    payload.created_by = req.user.id;
    payload.is_active = true;
    payload.showcase = JSON.stringify([
      {
        name: "Parental Leave",
        value: "28 Weeks",
      },
      {
        name: "Vacation Time",
        value: "30 days",
      },
      {
        name: "Gender Pay Gap",
        value: "25%",
      },
      {
        name: "Women in Senior Roles",
        value: "25%",
      },
      {
        name: "Pension",
        value: "10%",
      },
      {
        name: "Staff Discounts",
        value: "25%",
      },
      {
        name: "Employee Wellness & Benefits",
        value: "Free Heath Care",
      },
    ]);

    payload.external_links = JSON.stringify([
      {
        name: "",
        value: "",
      },
      {
        name: "",
        value: "",
      },
    ]);
    const company = UserModel.fromJson(payload);
    await company.$query().insert();

    return new SuccessResponse("company created and email sent!", {}).send(res);
  } catch (err) {
    next(err);
  }
}
