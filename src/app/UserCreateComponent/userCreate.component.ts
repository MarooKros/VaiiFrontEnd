import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../Services/auth.service';
import { UserService } from '../Services/user.service';
import { UserModel } from '../Models/UserModel';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule],
  providers: [UserService, AuthService],
  templateUrl: './userCreate.component.html',
  styleUrls: ['./userCreate.component.scss']
})
export class UserCreateComponent {
  @Output() userCreated = new EventEmitter<void>();
  @Output() closePopup = new EventEmitter<void>();

  user: UserModel = { id: 0, name: '', password: '' };
  password: string = '';
  confirmPassword: string = '';
  passwordsMatch: boolean = true;
  userExists: boolean = false;
  passwordValid: boolean = true;
  passwordErrorMessage: string = '';

  constructor(private userService: UserService, private authService: AuthService) {}

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
          this.authService.setUser(this.user);
          this.userCreated.emit();
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
