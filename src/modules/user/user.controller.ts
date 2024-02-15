import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/user.model";
import RoleModel from "../../models/role.model";
import { uploadFile, generateRandomPassword } from "../../libs/common";
import csvParser from "csv-parser";
import {
  SuccessResponse,
  InternalErrorResponse,
} from "../../core/api-response";
import {
  upsertUserSkills,
  getUserSkillsList,
  generateUserEducation,
  getUserDetail,
  updateUserEduction,
  generateUserExperience,
  updateUserExp,
  deleteUserExp,
  deleteUserEdu,
  getUserListing,
  getUserById,
  saveUserMember,
  unSaveUserMember,
  addUser,
  getAllSavedEntityCounts,
  getAllSavedMembersList,
  getAllSavedCompaniesList,
} from "../../services/user.services";
import { generateSalt, hashPassword, isPasswordValid } from "../../libs/common";
import {
  forgotPasswordTemplate,
  createUserTemplate,
} from "../../libs/email-templates";
import { sendEmailViaNodeMailer } from "../../utils/email";
import jwt from "jsonwebtoken";
import Logger from "../../libs/logger";
const JWT_SECRET = process.env.JWT_SECRET;

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, role_name } = req.body;
    let payload: any = req.body;
    const userData = await UserModel.query().where("email", email);

    if (userData.length > 0) {
      return new InternalErrorResponse("Email Already Exist").send(res);
    }

    if (req.file && req.file.filename) {
      const uploadRes = await uploadFile("hill-app/users", req.file.filename);
      if (uploadRes && uploadRes.s3Link) {
        payload.profile_image = uploadRes.s3Link;
      }
      fs.unlinkSync(`public/${req.file.filename}`);
    }

    if (payload.skills && typeof payload.skills === "string") {
      if (payload.skills.trim() === "") {
        payload.skills = [];
      } else {
        // Split the non-empty string into an array
        payload.skills = payload.skills.split(",").map((skill) => skill.trim());
      }
    }

    const roleDetail = await RoleModel.getRoleDetailByName(role_name);

    if (!roleDetail) {
      return new InternalErrorResponse("Role not Exist").send(res);
    }
    const salt = generateSalt(16);
    const encryptedPass = hashPassword(password, salt);
    delete payload.role_name;
    payload.password_salt = salt;
    payload.password = encryptedPass;
    payload.role_id = roleDetail.id;
    payload.is_active = true;
    const user = UserModel.fromJson(payload);
    const insertedUser = await user.$query().insert();
    delete insertedUser.password;
    const token = jwt.sign({ id: insertedUser.id }, JWT_SECRET);
    return new SuccessResponse(`User with role ${role_name} created!`, {
      token,
      user: insertedUser,
    }).send(res);
  } catch (e) {
    next(e);
  }
}

export async function loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const userData: any = await UserModel.query().findOne({
      email: email,
    });

    if (!userData) {
      return new InternalErrorResponse("Email not registered").send(res);
    }

    if (userData.is_active === false) {
      return new InternalErrorResponse("User is not active!").send(res);
    }
    const checkPass = isPasswordValid(
      userData.password,
      userData.password_salt,
      password
    );
    console.log(checkPass);
    if (!checkPass) {
      return new InternalErrorResponse("Password is not valid").send(res);
    }

    const token = jwt.sign({ id: userData.id }, JWT_SECRET);
    delete userData.password;
    return new SuccessResponse("Login Successful", {
      token: token,
      user: userData,
    }).send(res);
  } catch (e) {
    next(e);
  }
}

export async function checkEmailExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    const userData: any = await UserModel.query().findOne({
      email: email,
    });

    if (userData) {
      return new SuccessResponse("Email Already Exist", {
        isEmailExist: true,
      }).send(res);
    } else {
      return new SuccessResponse("Email Not Exist", {
        isEmailExist: false,
      }).send(res);
    }
  } catch (e) {
    next(e);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let payload = req.body;
    if (req.file && req.file.filename) {
      const uploadRes = await uploadFile("hill-app/users", req.file.filename);
      if (uploadRes && uploadRes.s3Link) {
        payload.profile_image = uploadRes.s3Link;
      }
    }

    if (payload.email) {
      const userData = await UserModel.query().where("email", payload.email);
      if (userData.length > 0) {
        return new InternalErrorResponse("Email Already Exist").send(res);
      }
    }

    if (payload.skills && typeof payload.skills === "string") {
      if (payload.skills.trim() === "") {
        payload.skills = [];
      } else {
        // Split the non-empty string into an array
        payload.skills = payload.skills.split(",").map((skill) => skill.trim());
      }
    }

    if (payload.password) {
      const salt = generateSalt(16);
      const encryptedPass = hashPassword(payload.password, salt);
      payload.password_salt = salt;
      payload.password = encryptedPass;
    }

    if (payload.is_active === false) {
      payload.is_active = false;
    }

    const resp: any = await UserModel.query()
      .findById(req.user.id)
      .patch(payload)
      .returning(`*`);
    delete resp.password;
    if (req.file && req.file.filename) {
      fs.unlinkSync(`public/${req.file.filename}`);
    }
    return new SuccessResponse("User updated successfully", resp).send(res);
  } catch (e) {
    console.log("Error in update User", JSON.stringify(e));
    next(e);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { member_id } = req.query;
    const resp = await getUserDetail({ user_id: req.user.id, member_id });
    delete resp.password;
    return new SuccessResponse("User retrieved successfully", resp).send(res);
  } catch (e) {
    next(e);
  }
}

export async function forgotPassword(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;

    const userDetails = await UserModel.query().findOne({
      email: email,
    });

    if (!userDetails) {
      return new InternalErrorResponse("Email not registered").send(res);
    }

    const random_token = `${Math.floor(Math.random() * 9000) + 1000}`;

    await UserModel.query()
      .update({ password_reset_token: random_token })
      .where("id", userDetails.id);

    userDetails.password_reset_token = random_token;
    // need to send email
    const forgotPassTemp = forgotPasswordTemplate(userDetails);
    await sendEmailViaNodeMailer({
      template: forgotPassTemp,
      subject: "Forgot Password",
      email: userDetails.email,
    });

    return new SuccessResponse(
      "Link has been sent to your email to reset your Password.",
      {}
    ).send(res);
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { password_reset_token, password } = req.body;

    const userData = await UserModel.query().findOne({
      password_reset_token,
    });

    if (!userData) {
      return new InternalErrorResponse("Reset password token not exist").send(
        res
      );
    }
    const salt = generateSalt(16);
    const encryptedPass = hashPassword(password, salt);

    await UserModel.query()
      .update({
        password_reset_token: "",
        password: encryptedPass,
        password_salt: salt,
      })
      .where("id", userData.id);

    return new SuccessResponse("password updated successfully", {}).send(res);
  } catch (err) {
    next(err);
  }
}

export async function updateUserSkills(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { skill_ids } = req.body;
    await upsertUserSkills(req.user.id, skill_ids);
    return new SuccessResponse("User skills updated successfully", {}).send(
      res
    );
  } catch (e) {
    next(e);
  }
}

export async function getUserSkills(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const resp = await getUserSkillsList(req.user.id);
    return new SuccessResponse("User skills retrieved successfully", resp).send(
      res
    );
  } catch (e) {
    next(e);
  }
}

export async function addUserEducations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    const resp = await generateUserEducation(payload);
    return new SuccessResponse("User education saved!", resp).send(res);
  } catch (e) {
    next(e);
  }
}

export async function updateUserEducation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { education_id } = req.params;
    let payload = req.body;
    payload.user_id = req.user.id;
    const resp = await updateUserEduction(payload, education_id);
    return new SuccessResponse("User education updated!", resp).send(res);
  } catch (e) {
    next(e);
  }
}

export async function deleteUserEducation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { education_id } = req.params;
    const resp = await deleteUserEdu(education_id, req.user.id);
    return new SuccessResponse("User education deleted!", resp).send(res);
  } catch (e) {
    next(e);
  }
}

export async function addUserExperience(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const payload = req.body;
    payload.user_id = req.user.id;
    const resp = await generateUserExperience(payload);
    return new SuccessResponse("User experience saved!", resp).send(res);
  } catch (e) {
    next(e);
  }
}

export async function updateUserExperience(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { experience_id } = req.params;
    let payload = req.body;
    payload.user_id = req.user.id;
    const resp = await updateUserExp(payload, experience_id);
    return new SuccessResponse("User experience updated!", resp).send(res);
  } catch (e) {
    next(e);
  }
}

export async function deleteUserExperience(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { experience_id } = req.params;
    const resp = await deleteUserExp(experience_id, req.user.id);
    return new SuccessResponse("User experience deleted!", resp).send(res);
  } catch (e) {
    next(e);
  }
}

export async function getUserList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { type } = req.params;
    const { page = 0, limit = 10, full_name } = req.query;
    const resp = await getUserListing(type, page, limit, req.user.id, {
      full_name,
    });
    return new SuccessResponse("User listed!", resp).send(res);
  } catch (e) {
    next(e);
  }
}

export async function handleUserAction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { action } = req.params;
    const { member_id } = req.body;

    const getUserDetail = await getUserById(member_id);
    if (!getUserDetail) {
      return new InternalErrorResponse("User not found!").send(res);
    }

    if (action === "save") {
      await saveUserMember({ member_id, user_id: req.user.id });
    } else if (action === "unsave") {
      await unSaveUserMember({ member_id, user_id: req.user.id });
    } else {
      return new InternalErrorResponse("Invalid action!").send(res);
    }
    return new SuccessResponse(`User ${action}ed successfully!`, {}).send(res);
  } catch (e) {
    next(e);
  }
}

export async function getAllSavedEntity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { type } = req.params;
    const { page = 0, limit = 10 } = req.query;

    if (type === "members") {
      // get all saved members list
      const roleDetail = await RoleModel.getRoleDetailByName("candidate");

      const resp = await getAllSavedMembersList({
        page,
        limit,
        user_id: req.user.id,
        role_id: roleDetail.id,
      });
      return new SuccessResponse(`Saved members are!`, resp).send(res);
    } else if (type === "companies") {
      const roleDetail = await RoleModel.getRoleDetailByName("company_admin");

      const resp = await getAllSavedCompaniesList({
        page,
        limit,
        user_id: req.user.id,
        role_id: roleDetail.id,
      });
      return new SuccessResponse(`Saved companies are!`, resp).send(res);
    } else {
      const final = {};
      const companyRoleDetail = await RoleModel.getRoleDetailByName(
        "company_admin"
      );
      const candidateRoleDetail = await RoleModel.getRoleDetailByName(
        "candidate"
      );
      const resp = await getAllSavedEntityCounts({
        user_id: req.user.id,
        company_role_id: companyRoleDetail.id,
        member_role_id: candidateRoleDetail.id,
      });

      resp.forEach((item) => {
        const entityType = item[0].entity_type;
        const count = parseInt(item[0].count);
        final[entityType] = count;
      });

      return new SuccessResponse(`Saved Counts are!`, final).send(res);
    }
  } catch (e) {
    next(e);
  }
}

export async function importCandidates(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      return new InternalErrorResponse("File not provided!").send(res);
    }

    const filePath = req.file.path;

    // const processCSV = (filePath) => {
    //   return new Promise<void>((resolve, reject) => {
    //     const dataArray = [];

    //     let count = 0;
    //     let failedData = [];
    //     let operational = {}
    //     fs.createReadStream(filePath)
    //       .pipe(csvParser())
    //       .on("data", (data) => {
    //         dataArray.push(data);
    //       })
    //       .on("end", async () => {
    //         for (const data of dataArray) {

    //           try {
    //             console.log("<===========data", data);
    //             await addUser(data);
    //           } catch (err) {
    //             data.failed_reason =  JSON.stringify(err);
    //             failedData.push(data);
    //             console.log("Error in converting date", err);
    //           }
    //         }
    //         console.log("CSV file successfully processed");
    //         operational["failed"] = failedData;
    //         resolve(operational);
    //       })
    //       .on("error", (err) => {
    //         console.log("Error ", err);
    //         reject(err);
    //       });
    //   });
    // };

    const processCSV = (filePath): Promise<any> => {
      // Change 'any' to a more specific type if possible
      return new Promise<any>((resolve, reject) => {
        const dataArray = [];
        let count = 0;
        let failedData = [];
        let operational = {};

        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on("data", (data) => {
            dataArray.push(data);
          })
          .on("end", async () => {
            const roleDetail = await RoleModel.getRoleDetailByName("candidate");
            for (const data of dataArray) {
              let userData = {};
              try {
                userData["email"] = data.email;
                userData["full_name"] = `${data.firstName || ""} ${
                  data.lastName || ""
                }`;
                userData["role_id"] = roleDetail.id;
                const password = generateRandomPassword(8);
                const salt = generateSalt(16);
                const encryptedPass = hashPassword(password, salt);

                userData["password_salt"] = salt;
                userData["password"] = encryptedPass;
                userData["is_active"] = true;
                await addUser(userData);
                // now send email
                const createUserTemp = createUserTemplate({
                  full_name: `${data.firstName || ""} ${data.lastName || ""}`,
                  email: data.email,
                  password: password,
                });
                await sendEmailViaNodeMailer({
                  template: createUserTemp,
                  subject: "Welcome to The Hill App",
                  email: data.email,
                });
              } catch (err) {
                data.failed_reason = JSON.stringify(err);
                failedData.push(data);
                console.log("Error in converting date", err);
              }
            }
            console.log("CSV file successfully processed");
            operational["failed"] = failedData;
            resolve(operational);
          })
          .on("error", (err) => {
            console.log("Error ", err);
            reject(err);
          });
      });
    };

    processCSV(filePath)
      .then((data) => {
        return new SuccessResponse(
          "Users Imported successfully!",
          data
        ).send(res);
      })
      .catch((error) => {
        console.error("Error processing CSV:", error);
        return new InternalErrorResponse("Error in importing CSV!").send(res);
        // Handle the error appropriately
      });
  } catch (e) {
    next(e);
  }
}
