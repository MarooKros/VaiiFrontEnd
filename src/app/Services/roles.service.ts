import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from "../Models/UserModel";
import { RoleModel } from "../Models/RoleModel";

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'https://localhost:7295/api/roles';

  constructor(private http: HttpClient) {}

  getCurrentUserRole(user: UserModel): Observable<RoleModel> {
    return this.http.get<RoleModel>(
      `${this.apiUrl}/currentRole`,
      { params: { Id: user.id, Name: user.name, Password: user.password } });
  }

  editUserRole(userId: string, userRole: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/editRole`, { user: { Id: userId }, userRole });
  }
}
