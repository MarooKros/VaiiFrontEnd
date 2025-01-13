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
import { Role, RoleModel } from '../Models/RoleModel';
import { RolesService } from '../Services/roles.service';

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
  providers: [UserService, RolesService],
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
  showEditRolePopup: boolean = false;
  editName: string = '';
  editPassword: string = '';
  confirmPassword: string = '';
  selectedUser: UserModel | null = null;
  editRole: Role | null = null;
  roles = Object.values(Role);

  constructor(private userService: UserService, private rolesService: RolesService) {}

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
    this.rolesService.getCurrentUserRole(user).subscribe(
      (roleResponse: any) => {
        if (typeof roleResponse === 'number') {
          this.editRole = this.mapRoleNumberToEnum(roleResponse);
        } else if (roleResponse && roleResponse.role) {
          this.editRole = roleResponse.role;
        } else {
          this.editRole = Role.Visitor;
        }
      },
      (error) => {
        console.error('Error fetching user role:', error);
      }
    );
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

  saveRole() {
    if (this.selectedUser && this.editRole !== null) {
      this.rolesService.editUserRole(this.selectedUser.id.toString(), this.editRole).subscribe(() => {
        this.closeEditRolePopup();
        this.loadUsers();
      });
    }
  }

  mapRoleNumberToEnum(roleNumber: number): Role {
    switch (roleNumber) {
      case 0:
        return Role.Visitor;
      case 1:
        return Role.User;
      case 2:
        return Role.Admin;
      default:
        return Role.Visitor;
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

  closeEditRolePopup() {
    this.showEditRolePopup = false;
  }

  openEditNamePopup() {
    if (this.selectedUser) {
      this.editName = this.selectedUser.name;
      this.showEditNamePopup = true;
      this.showEditPasswordPopup = false;
      this.showEditRolePopup = false;
    }
  }

  openEditPasswordPopup() {
    if (this.selectedUser) {
      this.editPassword = '';
      this.confirmPassword = '';
      this.showEditPasswordPopup = true;
      this.showEditNamePopup = false;
      this.showEditRolePopup = false;
    }
  }

  openEditRolePopup() {
    if (this.selectedUser) {
      this.showEditRolePopup = true;
      this.showEditNamePopup = false;
      this.showEditPasswordPopup = false;
    }
  }

  onLoginSuccess() {
    if (this.currentUserComponent) {
      this.currentUserComponent.ngOnInit();
    }
    this.closeLoginPopup();
  }
}
