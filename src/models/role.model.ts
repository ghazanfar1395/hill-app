import { Model } from "objection";

export default class RoleModel extends Model {
  static tableName = "roles";

  id!: number;
  role_name: string;
  created_at!: Date;

  static get idColumn() {
    return ["id"];
  }

  $beforeInsert() {
    this.created_at = new Date();
  }

  // Define a static method to get the role name
  static async getRoleDetailByName(name) {
    const role = await RoleModel.query().findOne({ role_name: name });
    if (role) {
      return role;
    }
    return null;
  }
}
