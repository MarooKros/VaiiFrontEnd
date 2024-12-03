import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { UserModel } from '../Models/UserModel';

@Component({
  selector: 'app-current-user',
  template: `
    <div class="current-user-box">
      Currently logged in as: {{ currentUser?.name || 'Guest' }}
    </div>
  `,
  styleUrls: ['./currentUser.component.scss']
})
export class CurrentUserComponent implements OnInit {
  currentUser: UserModel | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      console.log('User received:', user); // Debugging line
      this.currentUser = user;
    });
  }
}
