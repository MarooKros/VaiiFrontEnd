import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { UserService } from '../Services/user.service';
import { AuthService } from '../Services/auth.service';
import { UserModel } from '../Models/UserModel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  providers: [UserService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  users: UserModel[] = [];
  name: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private authService: AuthService) {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  login() {
    const user = this.users.find(u => u.name === this.name && u.password === this.password);
    if (user) {
      this.authService.setUser(user);
      this.errorMessage = '';
      console.log('User logged in:', user);
      this.loginSuccess.emit();
    } else {
      this.errorMessage = 'Invalid name or password';
    }
  }
}
