import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UserCreateComponent } from '../UserCreateComponent/userCreate.component';
import { CurrentUserComponent } from '../CurrentUserComponent/currentUser.component';
import { LoginComponent } from '../LogginComponent/login.component';
import { LogginService } from '../Services/loggin.service';
import { Role } from '../Models/RoleModel';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    UserCreateComponent,
    CurrentUserComponent,
    LoginComponent
  ],
  providers: [LogginService],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  @ViewChild(CurrentUserComponent) currentUserComponent!: CurrentUserComponent;

  showCreateUserPopup: boolean = false;
  showLoginPopup: boolean = false;

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

  onLoginSuccess() {
    if (this.currentUserComponent) {
      this.currentUserComponent.ngOnInit();
    }
    this.closeLoginPopup();
  }

  onUserCreatedAndLoggedIn() {
    if (this.currentUserComponent) {
      this.currentUserComponent.ngOnInit();
    }
    this.closeCreateUserPopup();
  }

  shouldShowAdminButtons(): boolean {
    return this.currentUserComponent?.getCurrentUserRole() === Role.Admin;
  }
}
