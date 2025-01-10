import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LogginService } from '../Services/loggin.service';
import { UserModel } from '../Models/UserModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-user',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="current-user-box">
      Currently logged in as: {{ currentUser?.name || 'Guest' }}
      <button *ngIf="currentUser" (click)="logout()">Logout</button>
    </div>
  `,
  styleUrls: ['./currentUser.component.scss']
})
export class CurrentUserComponent implements OnInit, AfterViewInit {
  currentUser: UserModel | null = null;

  constructor(
    private logginService: LogginService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.logginService.getLoggedInUser().subscribe(
      user => {
        console.log('User received:', user);
        this.currentUser = user;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching logged in user:', error);
      }
    );

    this.logginService.getLoginObservable().subscribe(
      user => {
        console.log('User logged in:', user);
        this.currentUser = user;
        this.cdr.detectChanges();
      }
    );
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  logout(): void {
    this.logginService.logOutUser().subscribe(() => {
      this.currentUser = null;
      this.cdr.detectChanges();
      this.router.navigate([], {
        queryParams: { refresh: new Date().getTime() },
        queryParamsHandling: 'merge'
      });
    });
  }
}
