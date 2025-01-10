import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CurrentUserComponent } from '../CurrentUserComponent/currentUser.component';
import { LoginComponent } from '../LogginComponent/login.component';
import { UserCreateComponent } from '../UserCreateComponent/userCreate.component';
import { UserModel } from '../Models/UserModel';
import { UserService } from '../Services/user.service';

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
  providers: [UserService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild(CurrentUserComponent) currentUserComponent!: CurrentUserComponent;

  users: UserModel[] = [];
  selectedUserId: number | null = null;
  showCreateUserPopup: boolean = false;
  showLoginPopup: boolean = false;
  showEditNamePopup: boolean = false;
  showEditPasswordPopup: boolean = false;
  editName: string = '';
  editPassword: string = '';
  confirmPassword: string = '';
  selectedUser: UserModel | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  selectUser(user: UserModel): void {
    this.selectedUserId = user.id;
    this.selectedUser = user;
  }

  deleteUser(): void {
    if (this.selectedUserId !== null) {
      this.userService.deleteUser(this.selectedUserId).subscribe(() => {
        this.users = this.users.filter(user => user.id !== this.selectedUserId);
        this.selectedUserId = null;
        this.selectedUser = null;
        this.loadUsers();
      });
    }
  }

  saveName() {
    if (this.selectedUser) {
      this.selectedUser.name = this.editName;
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(() => {
        this.closeEditNamePopup();
        this.loadUsers();
      });
    }
  }

  savePassword() {
    if (this.editPassword === this.confirmPassword && this.selectedUser) {
      this.selectedUser.password = this.editPassword;
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(() => {
        this.closeEditPasswordPopup();
        this.loadUsers();
      });
    } else {
      alert('Passwords do not match');
    }
  }

  onUserCreated(): void {
    this.loadUsers();
    this.closeCreateUserPopup();
  }

  onUserCreatedAndLoggedIn(): void {
    if (this.currentUserComponent) {
      this.currentUserComponent.ngOnInit();
    }
    this.closeCreateUserPopup();
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

  closeEditPasswordPopup() {
    this.showEditPasswordPopup = false;
  }

  closeEditNamePopup() {
    this.showEditNamePopup = false;
  }

  openEditNamePopup() {
    if (this.selectedUser) {
      this.editName = this.selectedUser.name;
      this.showEditNamePopup = true;
      this.showEditPasswordPopup = false;
      this.loadUsers();
    }
  }

  openEditPasswordPopup() {
    if (this.selectedUser) {
      this.editPassword = '';
      this.confirmPassword = '';
      this.showEditPasswordPopup = true;
      this.showEditNamePopup = false;
    }
  }

  onLoginSuccess() {
    if (this.currentUserComponent) {
      this.currentUserComponent.ngOnInit();
    }
    this.closeLoginPopup();
  }
}
