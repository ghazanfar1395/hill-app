import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import {
  saveProject,
  getProjectList,
  getProjectDetail,
  delProject,
  updateProject,
} from "../../services/project.services";
import { SuccessResponse } from "../../core/api-response";
import { uploadFile } from "../../libs/common";

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { project_id } = req.params;
    let payload = req.body;
    let resp;
    payload.created_by = req.user.id;

    if (req.file && req.file.filename) {
      const uploadRes = await uploadFile(
        "hill-app/projects",
        req.file.filename
      );
      if (uploadRes && uploadRes.s3Link) {
        payload.cover_image_link = uploadRes.s3Link;
      }
      fs.unlinkSync(`public/${req.file.filename}`);
    }

    if (project_id) {
      resp = await updateProject(payload, project_id);
    } else {
      resp = await saveProject(payload);
    }
    return new SuccessResponse("project saved successfully!", resp).send(res);
  } catch (err) {
    next(err);
  }
}

export async function getProjects(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page = 0, limit = 10 } = req.query;
    const { project_id } = req.params;

    if (project_id) {
      const resp = await getProjectDetail({
        created_by: req.user.id,
        id: project_id,
      });
      return new SuccessResponse("project retrieved successfully!", resp).send(
        res
      );
    } else {
      const resp = await getProjectList({
        created_by: req.user.id,
        page,
        limit,
      });
      return new SuccessResponse("projects retrieved successfully!", resp).send(
        res
      );
    }
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { project_id } = req.params;

    await delProject({
      created_by: req.user.id,
      id: project_id,
    });
    return new SuccessResponse("project deleted successfully!", {}).send(res);
  } catch (err) {
    next(err);
  }
}
