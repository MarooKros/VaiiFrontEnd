import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LogginService } from '../Services/loggin.service';
import { UserService } from '../Services/user.service';
import { UserModel } from '../Models/UserModel';
import { RolesService } from '../Services/roles.service';
import { Role } from '../Models/RoleModel';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  providers: [UserService, LogginService, RolesService],
  templateUrl: './userCreate.component.html',
  styleUrls: ['./userCreate.component.scss']
})
export class UserCreateComponent {
  @Output() userCreated = new EventEmitter<void>();
  @Output() closePopup = new EventEmitter<void>();
  @Output() userCreatedAndLoggedIn = new EventEmitter<void>();

  user: UserModel = { id: 0, name: '', password: '' };
  password: string = '';
  confirmPassword: string = '';
  passwordsMatch: boolean = true;
  userExists: boolean = false;
  passwordValid: boolean = true;
  passwordErrorMessage: string = '';

  constructor(
    private userService: UserService,
    private logginService: LogginService,
    private rolesService: RolesService
  ) {}

  closePop() {
    this.closePopup.emit();
  }

  validatePassword(password: string): boolean {
    const minLength = 8;
    const hasCapitalLetter = /[A-Z]/.test(password);
    if (password.length < minLength) {
      this.passwordErrorMessage = 'Password must be at least 8 characters long.';
      return false;
    }
    if (!hasCapitalLetter) {
      this.passwordErrorMessage = 'Password must contain at least one capital letter.';
      return false;
    }
    this.passwordErrorMessage = '';
    return true;
  }

  createUser() {
    this.passwordsMatch = this.password === this.confirmPassword;
    if (!this.passwordsMatch) {
      this.passwordErrorMessage = 'Passwords do not match.';
      return;
    }

    this.passwordValid = this.validatePassword(this.password);
    if (!this.passwordValid) {
      return;
    }

    if (this.passwordsMatch && this.passwordValid) {
      this.user.password = this.password;
      this.userService.createUser(this.user).subscribe(
        response => {
          console.log('User created:', response);
          this.user.id = response.id;
          this.logginService.logInUser(this.user).subscribe(
            () => {
              this.rolesService.editUserRole(response.id, Role.User).subscribe(
                () => {
                  console.log('Role set to User for user:', response);
                  this.userCreated.emit();
                  this.closePopup.emit();
                  this.userCreatedAndLoggedIn.emit();
                },
                error => {
                  console.error('Error setting role to Admin:', error);
                }
              );
            },
            error => {
              console.error('Error logging in user:', error);
            }
          );
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.userExists = true;
            console.error('Error creating user: User already exists', error);
          } else {
            console.error('Error creating user:', error);
          }
        }
      );
    }
  }
}
