import ProjectModel from "../models/project.model";

import { InternalError } from "../core/api-error";

export async function saveProject(data) {
  try {
    return await ProjectModel.query().insert(data);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function updateProject(data, projectId) {
  try {
    return await ProjectModel.query().update(data).where({
      id: projectId,
      created_by: data.created_by,
    });
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getProjectList(data) {
  try {
    // debug query
    // ProjectModel.knex().on("query", (query) => {
    //   console.log(query.sql);
    // });

    return await ProjectModel.query()
      .where({
        created_by: data.created_by,
      })
      //.withGraphFetched("[industryDetail,skillNames]")
      .page(data.page, data.limit);
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function getProjectDetail(data) {
  try {
    const { id, created_by } = data;
    return await ProjectModel.query().findOne({
      id,
      created_by,
    });
  } catch (err) {
    throw new InternalError(err.toString());
  }
}

export async function delProject(data) {
  try {
    const { id, created_by } = data;
    await ProjectModel.query().delete().where({
      id,
      created_by,
    });
  } catch (err) {
    throw new InternalError(err.toString());
  }
}
