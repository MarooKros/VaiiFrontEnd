import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PostModel } from '../Models/PostModel';
import { CommentModel } from '../Models/CommentModel';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://localhost:7295/api/posts';

  constructor(private http: HttpClient, private userService: UserService) {}

  getPosts(): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${this.apiUrl}/getPosts`).pipe(
      switchMap(posts => {
        const userRequests = posts.map(post => this.userService.getUserById(post.userId));
        return forkJoin(userRequests).pipe(
          map(users => {
            posts.forEach((post, index) => {
              post.user = users[index];
              if (post.comments) {
                post.comments.forEach(comment => {
                  comment.user = users.find(user => user.id === comment.userId) || { id: 0, name: 'Anonymous', password: '' };
                });
              }
            });
            return posts;
          })
        );
      })
    );
  }

  getPostAfterEdit(): Observable<PostModel[]> {
    return this.http.get<PostModel[]>(`${this.apiUrl}/getPosts`);
  }

  getPostById(id: number): Observable<PostModel> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<PostModel>(`${this.apiUrl}/getPostById`, { params }).pipe(
      switchMap(post => this.userService.getUserById(post.userId).pipe(
        map(user => {
          post.user = user;
          return post;
        })
      ))
    );
  }

  createPost(post: PostModel): Observable<PostModel> {
    return this.http.post<PostModel>(`${this.apiUrl}/createPost`, post);
  }

  updatePost(id: number, post: PostModel): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.put<void>(`${this.apiUrl}/editPost`, post, { params });
  }

  addCommentToPost(postId: number, comment: CommentModel): Observable<void> {
    const params = new HttpParams().set('postId', postId.toString());
    return this.http.post<void>(`${this.apiUrl}/addCommentToPost`, comment, { params });
  }

  deletePost(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/deletePost`, { params });
  }

  deleteComment(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/deleteComment`, { params });
  }
}
