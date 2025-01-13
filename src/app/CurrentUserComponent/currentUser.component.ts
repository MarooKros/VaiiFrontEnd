import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LogginService } from '../Services/loggin.service';
import { RolesService } from '../Services/roles.service';
import { UserModel } from '../Models/UserModel';
import { Role, RoleModel } from '../Models/RoleModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-user',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="current-user-box">
      Currently logged in as: {{ currentUser?.name || 'Guest' }} (Role: {{ currentUserRole || 'Visitor' }})
      <button *ngIf="currentUser" (click)="logout()">Logout</button>
    </div>
  `,
  styleUrls: ['./currentUser.component.scss']
})
export class CurrentUserComponent implements OnInit, AfterViewInit {
  currentUser: UserModel | null = null;
  currentUserRole: Role | null = null;

  constructor(
    private logginService: LogginService,
    private rolesService: RolesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.logginService.getLoggedInUser().subscribe(
      user => {
        console.log('User received:', user);
        this.currentUser = user;
        this.fetchUserRole(user);
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
        this.fetchUserRole(user);
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
      this.currentUserRole = null;
      this.cdr.detectChanges();
      this.router.navigate(['/']);
    });
  }

  fetchUserRole(user: UserModel): void {
    if (user) {
      this.rolesService.getCurrentUserRole(user).subscribe(
        (roleResponse: any) => {
          if (typeof roleResponse === 'number') {
            this.currentUserRole = this.mapRoleNumberToEnum(roleResponse);
          } else if (roleResponse && roleResponse.role) {
            this.currentUserRole = roleResponse.role;
          } else {
            this.currentUserRole = Role.Visitor;
          }
          this.cdr.detectChanges();
        },
        error => {
          console.error('Error fetching user role:', error);
        }
      );
    } else {
      this.currentUserRole = Role.Visitor;
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

  getCurrentUserRole(): Role | null {
    return this.currentUserRole;
  }
}
