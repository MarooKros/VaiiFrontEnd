import { UserModel } from "./UserModel";

export interface CommentModel {
  id: number;
  postId: number;
  userId: number;
  User: UserModel;
  text: string;
}
