import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  handleExpressValidation,
  authorizeRole,
} from "../../middlewares/common";
import {
  createUser,
  loginUser,
  updateUser,
  getUser,
  forgotPassword,
  resetPassword,
  updateUserSkills,
  getUserSkills,
  addUserEducations,
  updateUserEducation,
  addUserExperience,
  updateUserExperience,
  deleteUserExperience,
  deleteUserEducation,
  getUserList,
  handleUserAction,
  checkEmailExist,
  importCandidates,
  getAllSavedEntity,
} from "./user.controller";
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
  upload.single("profile_image"),
  body("email").isEmail().notEmpty(),
  body("password").isString().notEmpty(),
  body("role_name").isString().notEmpty().isIn(["candidate"]),
  handleExpressValidation,
  createUser
);

router.post(
  "/login",
  body("email").isEmail().notEmpty(),
  body("password").isString().notEmpty(),
  handleExpressValidation,
  loginUser
);

router.post(
  "/is-email-exist",
  body("email").isEmail().notEmpty(),
  handleExpressValidation,
  checkEmailExist
);

router.patch(
  "/",
  upload.single("profile_image"),
  passport.authenticate("jwt", { session: false }),
  handleExpressValidation,
  authorizeRole(["candidate", "company_admin"]),
  updateUser
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  handleExpressValidation,
  authorizeRole(["candidate", "company_admin"]),
  getUser
);

router.get(
  "/list/:type",
  passport.authenticate("jwt", { session: false }),
  param("type").isString().notEmpty().isIn(["candidate", "company_admin"]),
  handleExpressValidation,
  authorizeRole(["candidate", "company_admin"]),
  getUserList
);

router.post(
  "/forgot-password",
  body("email").isString().notEmpty(),
  handleExpressValidation,
  forgotPassword
);

router.post(
  "/reset-password",
  body("password_reset_token").isString().notEmpty(),
  body("password").isString().notEmpty(),
  handleExpressValidation,
  resetPassword
);

router.patch(
  "/skills",
  body("skill_ids").isArray().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  updateUserSkills
);

router.get(
  "/skills",
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  getUserSkills
);

router.post(
  "/education",
  body("institution_name").isString().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  addUserEducations
);

router.patch(
  "/education/:education_id",
  param("education_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  updateUserEducation
);

router.delete(
  "/education/:education_id",
  param("education_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  deleteUserEducation
);

router.post(
  "/experience",
  body("job_title").isString().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  addUserExperience
);

router.patch(
  "/experience/:experience_id",
  param("experience_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  updateUserExperience
);

router.delete(
  "/experience/:experience_id",
  param("experience_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate"]),
  deleteUserExperience
);

router.post(
  "/action/:action",
  param("action").isString().notEmpty().isIn(["unsave", "save"]),
  body("member_id").isNumeric().notEmpty(),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate", "company_admin"]),
  handleUserAction
);

router.post(
  "/import-candidates",
  upload.single("candidates"),
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate", "company_admin"]),
  importCandidates
);

router.get(
  "/saved-entities/:type",
  param("type").isString().notEmpty().isIn(["members", "companies", "all"]),
  handleExpressValidation,
  passport.authenticate("jwt", { session: false }),
  authorizeRole(["candidate", "company_admin"]),
  getAllSavedEntity
);

export default router;
