import { Component } from '@angular/core';
import { UserService } from '../Services/user.service';
import { AuthService } from '../Services/auth.service';
import { UserModel } from '../Models/UserModel';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  providers: [UserService, AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
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
    } else {
      this.errorMessage = 'Invalid name or password';
    }
  }
}
