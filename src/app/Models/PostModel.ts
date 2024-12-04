import { CommentModel } from "./CommentModel";
import { UserModel } from "./UserModel";

export interface PostModel {
  id: number;
  userId: number;
  user: UserModel;
  title: string;
  text: string;
  comments?: CommentModel[] | null;
}
