import { Routes } from '@angular/router';
import { PostComponent } from './PostComponent/post.component';
import { MainComponent } from './MainComponent/main.component';
import { UserComponent } from './UserComponent/user.component';
import { UserCreateComponent } from './UserCreateComponent/userCreate.component';
import { LoginComponent } from './LogginComponent/login.component';
import { IssueComponent } from './IssueComponent/issue.component';


export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'post', component: PostComponent },
  { path: 'user', component: UserComponent },
  { path: 'userCreate', component: UserCreateComponent },
  { path: 'login', component: LoginComponent },
  { path: 'issue', component: IssueComponent },
  { path: '**', redirectTo: '' }
];
