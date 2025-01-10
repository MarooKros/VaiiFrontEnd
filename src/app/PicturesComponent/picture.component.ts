import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CurrentUserComponent } from '../CurrentUserComponent/currentUser.component';
import { LoginComponent } from '../LogginComponent/login.component';
import { UserCreateComponent } from '../UserCreateComponent/userCreate.component';
import { UserService } from '../Services/user.service';
import { LogginService } from '../Services/loggin.service';

import { PictureModel } from '../Models/PictureModel';
import { PictureService } from '../Services/picture.component';

@Component({
  selector: 'app-picture',
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
  providers: [
    UserService,
    LogginService,
    PictureService
  ],
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss']
})
export class PictureComponent implements OnInit {
  @ViewChild(CurrentUserComponent) currentUserComponent!: CurrentUserComponent;

  username: string = '';
  pictures: PictureModel[] = [];
  showCreateUserPopup: boolean = false;
  showLoginPopup: boolean = false;

  constructor(
    private userService: UserService,
    private pictureService: PictureService,
    private logginService: LogginService
  ) {}

  ngOnInit(): void {}

  searchPicturesByUsername(): void {
    this.userService.getUsers().subscribe(
      users => {
        const filteredUsers = users.filter(user => user.name === this.username);
        if (filteredUsers.length > 0) {
          filteredUsers.forEach(user => {
            this.pictureService.getPicturesByUserId(user.id).subscribe(
              pictures => {
                this.pictures = this.pictures.concat(pictures);
              },
              error => {
                console.error('Error fetching pictures:', error);
              }
            );
          });
        } else {
          console.error('User not found');
          this.pictures = [];
        }
      },
      error => {
        console.error('Error fetching users:', error);
        this.pictures = [];
      }
    );
  }

  byteArrayToBase64(byteArray: number[]): string {
    let binary = '';
    const len = byteArray.length;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return window.btoa(binary);
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

  onUserCreatedAndLoggedIn() {
    if (this.currentUserComponent) {
      this.currentUserComponent.ngOnInit();
    }
    this.closeCreateUserPopup();
  }

  onLoginSuccess() {
    if (this.currentUserComponent) {
      this.currentUserComponent.ngOnInit();
    }
    this.closeLoginPopup();
  }
}
