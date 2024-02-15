import { validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import UserModel from "../models/user.model";
import RoleModel from "../models/role.model";
export async function handleExpressValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });
  else next();
}

export function authorizeRole(roles: string[]): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userDetail: any = await UserModel.query()
      .select("role_id", "id", "is_active")
      .findById(req.user.id)
      .withGraphFetched("roleDetail");
    console.log(userDetail);
    if (userDetail.is_active === false) {
      return res.status(403).json({ message: "User is not active" });
    }

    const roleDetail: any = userDetail.roleDetail || null;
    if (!roleDetail) {
      return res.status(403).json({ message: "Role not found" });
    }

    if (!roles.includes(roleDetail.role_name)) {
      return res.status(403).json({ message: "Permission not allowed!" });
    }
    req.roleDetail = roleDetail;
    next(); // Call next to pass control to the next middleware or route handler
  };
}
