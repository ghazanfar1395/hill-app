import ProjectModel from "../models/project.model";

import { InternalError } from "../core/api-error";

export async function saveCompany(data) {
  try {
    return await ProjectModel.query().insert(data);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}
