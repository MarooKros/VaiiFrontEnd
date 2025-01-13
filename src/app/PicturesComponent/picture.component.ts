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
import { PictureService } from '../Services/picture.service';

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
  ) {}

  ngOnInit(): void {
    this.loadAllPictures();
  }

  loadAllPictures(): void {
    this.pictureService.getAllPictures().subscribe(
      pictures => {
        this.pictures = pictures.map(picture => ({
          ...picture,
          img: `${picture.img}`
        }));
      },
      (error: any) => {
        console.error('Error fetching pictures:', error);
        this.pictures = [];
      }
    );
  }

  searchPicturesByUsername(): void {
    if (!this.username) {
      this.loadAllPictures();
      return;
    }

    this.userService.getUsers().subscribe(
      users => {
        const user = users.find(user => user.name === this.username);
        if (user) {
          this.pictureService.getAllPictures().subscribe(
            pictures => {
              this.pictures = pictures
                .filter(picture => picture.user.id === user.id)
                .map(picture => ({
                  ...picture,
                  img: `${picture.img}`
                }));
            },
            (error: any) => {
              console.error('Error fetching pictures:', error);
              this.pictures = [];
            }
          );
        } else {
          console.error('User not found');
          this.pictures = [];
        }
      },
      (error: any) => {
        console.error('Error fetching users:', error);
        this.pictures = [];
      }
    );
  }

  deletePicture(picture: PictureModel): void {
    this.pictureService.deletePicture(picture.id).subscribe(
      () => {
        this.pictures = this.pictures.filter(p => p.id !== picture.id);
      },
      (error: any) => {
        console.error('Error deleting picture:', error);
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
