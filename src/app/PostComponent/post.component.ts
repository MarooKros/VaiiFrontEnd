import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { PostModel } from '../Models/PostModel';
import { CommentModel } from '../Models/CommentModel';
import { PostService } from '../Services/post.service';
import { LogginService } from '../Services/loggin.service';
import { PictureModel } from '../Models/PictureModel';
import { PictureService } from '../Services/picture.service';
import { Role } from '../Models/RoleModel';

import { UserCreateComponent } from '../UserCreateComponent/userCreate.component';
import { CurrentUserComponent } from '../CurrentUserComponent/currentUser.component';
import { LoginComponent } from '../LogginComponent/login.component';

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
  providers: [
    PostService,
    LogginService,
    PictureService
  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @ViewChild(CurrentUserComponent) currentUserComponent!: CurrentUserComponent;

  posts: PostModel[] = [];
  newPost: PostModel = { id: 0, userId: 1, user: { id: 1, name: 'Default User', password: '' }, title: '', text: '', comments: [] };
  newComment: CommentModel = { id: 0, postId: 0, userId: 1, user: { id: 1, name: 'Default User', password: '' }, text: '' };
  selectedCommentId: number | null = null;
  errorMessage: string | null = null;
  showCreateUserPopup: boolean = false;
  showLoginPopup: boolean = false;
  isEditing: boolean = false;
  currentUserId: number | null = null;
  postImage: PictureModel | null = null;
  commentImage: PictureModel | null = null;
  isVisitor: boolean = false;

  constructor(
    private postService: PostService,
    private logginService: LogginService,
    private pictureService: PictureService,
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.updateUserRole();
  }

  updateUserRole(): void {
    this.logginService.getLoggedInUser().subscribe(
      user => {
        this.currentUserId = user?.id || null;
        this.isVisitor = this.currentUserComponent.getCurrentUserRole() === Role.Visitor;
      },
      error => {
        if (error.status === 404) {
          this.currentUserId = null;
          this.isVisitor = true;
        } else {
          console.error('Error fetching logged-in user:', error);
        }
      }
    );
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

  createOrUpdatePost(): void {
    const currentUserRole = this.currentUserComponent.getCurrentUserRole();
    if (currentUserRole === Role.Visitor) {
      this.errorMessage = 'Visitors cannot create or update posts.';
      return;
    }

    if (!this.newPost.title || !this.newPost.text) {
      this.errorMessage = 'Title and content are required!';
      return;
    }
    this.errorMessage = null;

    this.logginService.getLoggedInUser().subscribe(currentUser => {
      if (currentUser) {
        this.newPost.user = currentUser;
        this.newPost.userId = currentUser.id;
        this.newPost.comments = [];

        if (this.isEditing) {
          this.postService.updatePost(this.newPost.id, this.newPost).subscribe(
            () => {
              this.loadPosts();
              this.resetForm();
            },
            (error) => {
              console.error('Error updating post:', error);
              this.errorMessage = 'Could not update the post. Please try again later.';
            }
          );
        } else {
          this.postService.createPost(this.newPost).subscribe(
            (createdPost) => {
              this.posts.unshift(createdPost);
              this.resetForm();
            },
            (error) => {
              console.error('Error creating post:', error);
              this.errorMessage = 'Could not create the post. Please try again later.';
            }
          );
        }
      } else {
        this.errorMessage = 'User not logged in.';
      }
    });
  }

  editPost(post: PostModel): void {
    this.newPost = { ...post };
    this.isEditing = true;
  }

  resetForm(): void {
    this.newPost = { id: 0, userId: 1, user: { id: 1, name: 'Default User', password: '' }, title: '', text: '', comments: [] };
    this.isEditing = false;
    this.postImage = null;
  }

  addComment(postId: number): void {
    const currentUserRole = this.currentUserComponent.getCurrentUserRole();
    if (currentUserRole === Role.Visitor) {
      this.errorMessage = 'Visitors cannot add comments.';
      return;
    }

    if (!this.newComment.text && !this.commentImage) {
      this.errorMessage = 'Comment text or image is required!';
      return;
    }
    this.errorMessage = null;

    this.logginService.getLoggedInUser().subscribe(currentUser => {
      if (currentUser) {
        this.newComment.user = currentUser;
        this.newComment.userId = currentUser.id;
        this.newComment.postId = postId;

        if (this.commentImage) {
          this.commentImage.user = currentUser;
          this.pictureService.createPicture(this.commentImage).subscribe(
            (createdPicture: PictureModel) => {
              this.newComment.text += `<br><img src="${createdPicture.img}" alt="Comment Image" class="comment-image" />`;
              this.saveComment(postId, currentUser);
            },
            (error) => {
              console.error('Error saving picture:', error);
              this.errorMessage = 'Could not save the picture. Please try again later.';
            }
          );
        } else {
          this.saveComment(postId, currentUser);
        }
      } else {
        this.errorMessage = 'User not logged in.';
      }
    });
  }

  saveComment(postId: number, currentUser: any): void {
    this.postService.addCommentToPost(postId, this.newComment).subscribe(
      () => {
        this.newComment = { id: 0, postId: 0, userId: currentUser.id, user: currentUser, text: '' };
        this.commentImage = null;
        this.loadPosts();
      },
      (error) => {
        console.error('Error adding comment:', error);
        this.errorMessage = 'Could not add the comment. Please try again later.';
      }
    );
  }

  deletePost(postId: number): void {
    this.logginService.getLoggedInUser().subscribe(currentUser => {
      this.postService.getPostById(postId).subscribe(post => {
        const currentUserRole = this.currentUserComponent.getCurrentUserRole();
        if (post.userId === currentUser?.id || currentUserRole === Role.Admin) {
          this.postService.deletePost(postId).subscribe(() => {
            this.loadPosts();
          }, error => {
            console.error('Error deleting post', error);
          });
        } else {
          console.error('User is not authorized to delete this post');
        }
      }, error => {
        console.error('Error fetching post', error);
      });
    });
  }

  selectComment(commentId: number): void {
    this.selectedCommentId = this.selectedCommentId === commentId ? null : commentId;
  }

  deleteComment(commentId: number): void {
    this.logginService.getLoggedInUser().subscribe(currentUser => {
      this.postService.getPosts().subscribe(posts => {
        const comment = posts.flatMap(post => post.comments || []).find(comment => comment.id === commentId);
        const currentUserRole = this.currentUserComponent.getCurrentUserRole();
        if (comment && (comment.userId === currentUser?.id || currentUserRole === Role.Admin)) {
          this.postService.deleteComment(commentId).subscribe(() => {
            const imgSrcMatch = comment.text.match(/<br><img src="([^"]+)"/);
            if (imgSrcMatch) {
              const imgSrc = imgSrcMatch[1];
              this.pictureService.getAllPictures().subscribe(pictures => {
                const picture = pictures.find(p => p.img === imgSrc);
                if (picture) {
                  this.pictureService.deletePicture(picture.id).subscribe(() => {
                    this.loadPosts();
                  }, error => {
                    console.error('Error deleting associated picture:', error);
                  });
                } else {
                  this.loadPosts();
                }
              }, error => {
                console.error('Error fetching pictures:', error);
                this.loadPosts();
              });
            } else {
              this.loadPosts();
            }
          }, error => {
            console.error('Error deleting comment:', error);
          });
        } else {
          console.error('User is not authorized to delete this comment');
          this.resetForm();
        }
      }, error => {
        console.error('Error fetching posts', error);
        this.resetForm();
      });
    });
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
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
    this.updateUserRole();
    this.loadPosts();
  }

  closeCreateUserPopup() {
    this.showCreateUserPopup = false;
    this.updateUserRole();
    this.loadPosts();
  }

  onUserCreatedAndLoggedIn() {
    this.closeCreateUserPopup();
    this.updateUserRole();
    this.loadPosts();
  }

  onLogout() {
    this.logginService.logOutUser().subscribe(() => {
      this.currentUserId = null;
      this.isVisitor = true;
      this.updateUserRole();
      this.loadPosts();
    });
  }

  onPostImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.postImage = { id: 0, img: reader.result as string, user: { id: this.currentUserId!, name: '', password: '' } };
      };
      reader.readAsDataURL(file);
    }
  }

  onCommentImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.commentImage = { id: 0, img: reader.result as string, user: { id: this.currentUserId!, name: '', password: '' } };
      };
      reader.readAsDataURL(file);
    }
  }
}
