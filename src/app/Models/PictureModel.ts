import { UserModel } from "./UserModel";

export interface PictureModel {
  id: number;
  img: string;
  user: UserModel;
}
