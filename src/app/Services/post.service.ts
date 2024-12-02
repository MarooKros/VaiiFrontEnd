import axios from 'axios';
import { PostModel } from '../Models/PostModel';
import { CommentModel } from '../Models/CommentModel';

class PostService {
  private apiUrl = 'http://localhost:7295/api/posts';

  async getPosts(): Promise<PostModel[]> {
    const response = await axios.get<PostModel[]>(`${this.apiUrl}/getPosts`);
    return response.data;
  }

  async getPostById(id: number): Promise<PostModel> {
    const response = await axios.get<PostModel>(`${this.apiUrl}/getPostById`, { params: { id } });
    return response.data;
  }

  async createPost(post: PostModel): Promise<PostModel> {
    const response = await axios.post<PostModel>(`${this.apiUrl}/createPost`, post);
    return response.data;
  }

  async updatePost(id: number, post: PostModel): Promise<void> {
    await axios.put(`${this.apiUrl}/editPost`, post, { params: { id } });
  }

  async addCommentToPost(postId: number, comment: CommentModel): Promise<void> {
    await axios.post(`${this.apiUrl}/addCommentToPost`, comment, { params: { postId } });
  }

  async deletePost(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/deletePost`, { params: { id } });
  }

  async deleteComment(id: number): Promise<void> {
    await axios.delete(`${this.apiUrl}/deleteComment`, { params: { id } });
  }
}

export default new PostService();
