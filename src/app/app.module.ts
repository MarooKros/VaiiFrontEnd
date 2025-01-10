import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { PostService } from './Services/post.service';
import { UserService } from './Services/user.service';
import { IssueService } from './Services/issue.service';
import { LogginService } from './Services/loggin.service';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    PostService,
    UserService,
    IssueService,
    LogginService
  ],
})
export class AppModule {}
