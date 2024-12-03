import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../Services/user.service';
import { UserModel } from '../Models/UserModel';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../Services/auth.service';

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

  constructor(private userService: UserService, private authService: AuthService) {}
  closePop() {
    this.closePopup.emit();
  }

  createUser() {
    this.passwordsMatch = this.password === this.confirmPassword;
    if (this.passwordsMatch) {
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
            console.error('Error creating user:', error);
          }
        }
      );
    }
  }
}
