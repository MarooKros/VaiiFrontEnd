import { Component, OnInit } from '@angular/core';
import { UserModel } from '../Models/UserModel';
import { UserService } from '../Services/user.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CurrentUserComponent } from '../CurrentUserComponent/currentUser.component';
import { LoginComponent } from '../LogginComponent/login.component';
import { UserCreateComponent } from '../UserCreateComponent/userCreate.component';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    UserCreateComponent,
    CurrentUserComponent,
    LoginComponent
  ],
  providers: [UserService,AuthService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users: UserModel[] = [];
  selectedUserId: number | null = null;
  showCreateUserPopup: boolean = false;
  showLoginPopup: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data: UserModel[]) => {
      this.users = data;
    });
  }

  selectUser(user: UserModel): void {
    this.selectedUserId = user.id;
  }

  deleteUser(): void {
    if (this.selectedUserId !== null) {
      this.userService.deleteUser(this.selectedUserId).subscribe(() => {
        this.users = this.users.filter(user => user.id !== this.selectedUserId);
        this.selectedUserId = null;
      });
    }
  }

  openLoginPopup() {
    this.showLoginPopup = true;
    this.showCreateUserPopup = false;
  }

  openCreateUserPopup() {
    this.showCreateUserPopup = true;
    this.showLoginPopup = false;
  }

  closeLoginPopup() {
    this.showLoginPopup = false;
  }

  closeCreateUserPopup() {
    this.showCreateUserPopup = false;
  }
}

