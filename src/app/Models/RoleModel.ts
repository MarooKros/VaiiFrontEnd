import { UserModel } from "./UserModel";

export interface RoleModel {
  id: number;
  role: Role;
  users: UserModel;
}

export enum Role {
  Visitor = 'Visitor',
  User = 'User',
  Admin = 'Admin'
}
