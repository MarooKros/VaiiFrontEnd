import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';
import { PostService } from './Services/post.service';
import { UserService } from './Services/user.service';
import { AuthService } from './Services/auth.service';
import { IssueService } from './Services/issue.service';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule],
  providers: [
    PostService,
    UserService,
    AuthService,
    IssueService
  ],
})
export class AppModule {}
