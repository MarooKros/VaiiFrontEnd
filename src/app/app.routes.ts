import { Routes } from '@angular/router';
import { PostComponent } from './post/post.component';
import { MainComponent } from './MainComponent/main.component';


export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'post', component: PostComponent },
  { path: '**', redirectTo: '' }
];
