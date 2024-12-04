import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PostModel } from '../Models/PostModel';
import { CommentModel } from '../Models/CommentModel';
import { PostService } from '../Services/post.service';
import { UserCreateComponent } from '../UserCreateComponent/userCreate.component';
import { CurrentUserComponent } from '../CurrentUserComponent/currentUser.component';
import { LoginComponent } from '../LogginComponent/login.component';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    UserCreateComponent,
    CurrentUserComponent,
    LoginComponent
  ],
  providers: [PostService, AuthService],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  posts: PostModel[] = [];
  newPost: PostModel = { id: 0, userId: 1, user: { id: 1, name: 'Default User', password: '' }, title: '', text: '', comments: null };
  errorMessage: string | null = null;
  showCreateUserPopup: boolean = false;
  showLoginPopup: boolean = false;

  constructor(private postService: PostService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe(
      (data) => {
        this.posts = data;
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }

  createPost(): void {
    if (!this.newPost.title || !this.newPost.text) {
      this.errorMessage = 'Title and content are required!';
      return;
    }
    this.errorMessage = null;

    const currentUser = this.authService.getUser();
    if (currentUser) {
      this.newPost.user = currentUser;
      this.newPost.userId = currentUser.id;
      this.newPost.comments = null;

      this.postService.createPost(this.newPost).subscribe(
        (createdPost) => {
          this.posts.unshift(createdPost);
          this.newPost = { id: 0, userId: currentUser.id, user: currentUser, title: '', text: '', comments: null };
        },
        (error) => {
          console.error('Error creating post:', error);
          this.errorMessage = 'Could not create the post. Please try again later.';
        }
      );
    } else {
      this.errorMessage = 'User not logged in.';
    }
  }

  openLoginPopup() {
    this.showLoginPopup = true;
    this.showCreateUserPopup = false;
  }

  openCreateUserPopup() {
    this.showCreateUserPopup = true;
    this.showLoginPopup = false;
  }

  closeLoginPopup() {
    this.showLoginPopup = false;
  }

  closeCreateUserPopup() {
    this.showCreateUserPopup = false;
  }
}
