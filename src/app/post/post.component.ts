import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PostModel } from '../Models/PostModel';
import { CommentModel } from '../Models/CommentModel';
import { PostService } from '../Services/post.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  providers: [PostService],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  posts: PostModel[] = [];
  newPost: PostModel = { id: 0, userId: 1, user: { id: 1, name: 'Default User', password: '' }, title: '', text: '', comments: [] };
  errorMessage: string | null = null;

  constructor(private postService: PostService) {}

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

    this.postService.createPost(this.newPost).subscribe(
      (createdPost) => {
        this.posts.unshift(createdPost);
        this.newPost = { id: 0, userId: 1, user: { id: 1, name: 'Default User', password: '' }, title: '', text: '', comments: [] };
      },
      (error) => {
        console.error('Error creating post:', error);
        this.errorMessage = 'Could not create the post. Please try again later.';
      }
    );
  }
}
