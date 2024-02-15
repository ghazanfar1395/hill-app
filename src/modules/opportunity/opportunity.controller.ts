import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import {
  saveOpportunity,
  saveUserOpportunity,
  getSingleOpportunity,
  updateOpportunity,
  removeOpportunity,
  getOpportunityList,
  getSavedOpportunities,
  likeUserOpportunity,
  getLikedOpportunities,
  unSaveUserOpportunity,
  getOpportunityByUserId,
  inviteUserOpportunity,
} from "../../services/opportunity.services";
import {
  SuccessResponse,
  InternalErrorResponse,
} from "../../core/api-response";
import { uploadFile } from "../../libs/common";

export async function createOpportunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let payload = req.body;
    if (req.file && req.file.filename) {
      const uploadRes = await uploadFile(
        "hill-app/opportunities",
        req.file.filename
      );
      if (uploadRes && uploadRes.s3Link) {
        payload.image_path = uploadRes.s3Link;
      }
    }

    if (payload.hashtags && typeof payload.hashtags === "string") {
      if (payload.hashtags.trim() === "") {
        payload.hashtags = [];
      } else {
        // Split the non-empty string into an array
        payload.hashtags = payload.hashtags.split(",").map((t) => t.trim());
      }
    }

    if (payload.requirements && typeof payload.requirements === "string") {
      if (payload.requirements.trim() === "") {
        payload.requirements = [];
      } else {
        payload.requirements = payload.requirements
          .split("|")
          .map((t) => t.trim());
      }
    }

    payload.created_by = req.user.id;
    const resp = await saveOpportunity(payload);
    if (req.file && req.file.filename) {
      fs.unlinkSync(`public/${req.file.filename}`);
    }

    return new SuccessResponse("Opportunity saved successfully!", resp).send(
      res
    );
  } catch (err) {
    next(err);
  }
}

export async function patchOpportunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { opportunity_id } = req.params;
    // first check opportunity exist in database
    const opportunity = await getSingleOpportunity(opportunity_id);
    if (!opportunity) {
      return new InternalErrorResponse("Opportunity not found!").send(res);
    }

    let payload = req.body;
    if (req.file && req.file.filename) {
      const uploadRes = await uploadFile(
        "hill-app/opportunities",
        req.file.filename
      );
      if (uploadRes && uploadRes.s3Link) {
        payload.image_path = uploadRes.s3Link;
      }
    }

    if (payload.hashtags && typeof payload.hashtags === "string") {
      if (payload.hashtags.trim() === "") {
        payload.hashtags = [];
      } else {
        // Split the non-empty string into an array
        payload.hashtags = payload.hashtags.split(",").map((t) => t.trim());
      }
    }

    if (payload.requirements && typeof payload.requirements === "string") {
      if (payload.requirements.trim() === "") {
        payload.requirements = [];
      } else {
        payload.requirements = payload.requirements
          .split("|")
          .map((t) => t.trim());
      }
    }

    const resp = await updateOpportunity(payload, opportunity_id, req.user.id);
    if (req.file && req.file.filename) {
      fs.unlinkSync(`public/${req.file.filename}`);
    }
    return new SuccessResponse("Opportunity update successfully!", resp).send(
      res
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteOpportunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { opportunity_id } = req.params;

    const opportunity = await getSingleOpportunity(opportunity_id);
    if (!opportunity) {
      return new InternalErrorResponse("Opportunity not found!").send(res);
    }

    const resp = await removeOpportunity(opportunity_id, req.user.id);
    return new SuccessResponse("Opportunity deleted successfully!", resp).send(
      res
    );
  } catch (err) {
    next(err);
  }
}

export async function handleActionOpportunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { opportunity_id } = req.body;
    const { action } = req.params;
    const opportunity = await getSingleOpportunity(opportunity_id);
    if (!opportunity) {
      return new InternalErrorResponse("Opportunity not found!").send(res);
    }
    if (action === "save") {
      await saveUserOpportunity({ opportunity_id, user_id: req.user.id });
    } else if (action === "unsave") {
      await unSaveUserOpportunity({ opportunity_id, user_id: req.user.id });
    } else {
      return new InternalErrorResponse("Invalid action!").send(res);
    }
    return new SuccessResponse(`Opportunity ${action} successfully!`, {}).send(
      res
    );
  } catch (err) {
    next(err);
  }
}

export async function getSaveOpportunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page = 0, limit = 10 } = req.query;
    const resp = await getSavedOpportunities({
      user_id: req.user.id,
      page,
      limit,
    });

    return new SuccessResponse(
      "Opportunities retrieved successfully!",
      resp
    ).send(res);
  } catch (err) {
    next(err);
  }
}

export async function getLikedOpportunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page = 0, limit = 10 } = req.query;
    const resp = await getLikedOpportunities({
      user_id: req.user.id,
      page,
      limit,
    });
    return new SuccessResponse(
      "Opportunities retrieved successfully!",
      resp
    ).send(res);
  } catch (err) {
    next(err);
  }
}

export async function listOpportunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      page = 0,
      limit = 10,
      user_id,
      status,
      opportunity_role,
    } = req.query;

    const resp = await getOpportunityList({
      user_id,
      page,
      limit,
      loggedInUserId: req.user.id,
      status,
      opportunity_role,
    });
    return new SuccessResponse("Opportunity listed successfully!", resp).send(
      res
    );
  } catch (err) {
    next(err);
  }
}

export async function getOpportunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { opportunity_id } = req.params;

    const opportunity = await getOpportunityByUserId(
      opportunity_id,
      req.user.id
    );
    if (!opportunity) {
      return new InternalErrorResponse("Opportunity not found!").send(res);
    }

    return new SuccessResponse(
      "Opportunity retrieved successfully!",
      opportunity
    ).send(res);
  } catch (err) {
    next(err);
  }
}

export async function LikeOpportunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { opportunity_id } = req.body;
    const opportunity = await getSingleOpportunity(opportunity_id);
    if (!opportunity) {
      return new InternalErrorResponse("Opportunity not found!").send(res);
    }
    await likeUserOpportunity({ opportunity_id, user_id: req.user.id });
    return new SuccessResponse("Opportunity liked successfully!", {}).send(res);
  } catch (err) {
    next(err);
  }
}

export async function inviteUserForOpportunity(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { opportunity_id, user_ids } = req.body;
    const opportunity = await getSingleOpportunity(opportunity_id);
    if (!opportunity) {
      return new InternalErrorResponse("Opportunity not found!").send(res);
    }
    if (user_ids && user_ids.length < 1) {
      return new InternalErrorResponse("Users array is empty!").send(res);
    }
    await inviteUserOpportunity({
      opportunity_id,
      user_ids,
      created_by: req.user.id,
    });
    return new SuccessResponse("Users invited successfully!", {}).send(res);
  } catch (err) {
    next(err);
  }
}
