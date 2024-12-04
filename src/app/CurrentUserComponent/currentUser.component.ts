import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { UserModel } from '../Models/UserModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-user',
  imports: [CommonModule],
  template: `
    <div class="current-user-box">
      Currently logged in as: {{ currentUser?.name || 'Guest' }}
      <button *ngIf="currentUser" (click)="logout()">Logout</button>
    </div>
  `,
  styleUrls: ['./currentUser.component.scss']
})
export class CurrentUserComponent implements OnInit {
  currentUser: UserModel | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      console.log('User received:', user);
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
  }
}
