import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { UserService } from '../Services/user.service';
import { LogginService } from '../Services/loggin.service';
import { UserModel } from '../Models/UserModel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  providers: [UserService, LogginService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  name: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private logginService: LogginService, private router: Router) {}

  login() {
    this.userService.getUsers().subscribe(
      (users: UserModel[]) => {
        const user = users.find(u => u.name === this.name && u.password === this.password);
        if (user) {
          this.logginService.logInUser(user).subscribe(
            () => {
              this.errorMessage = '';
              console.log('User logged in:', user);
              this.loginSuccess.emit();
              this.logginService.getLoggedInUser().subscribe(
                loggedInUser => {
                  console.log('Logged in user:', loggedInUser);
                  this.router.navigate([], {
                    queryParams: { refresh: new Date().getTime() },
                    queryParamsHandling: 'merge'
                  });
                },
                error => {
                  console.error('Error fetching logged in user:', error);
                }
              );
            },
            error => {
              this.errorMessage = 'Error logging in';
              console.error('Error logging in:', error);
            }
          );
        } else {
          this.errorMessage = 'Invalid name or password';
        }
      },
      error => {
        this.errorMessage = 'Error fetching users';
      }
    );
  }
}
