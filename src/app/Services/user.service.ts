import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../Models/UserModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7295/api/user';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}/getUsers`);
  }

  getUserById(id: number): Observable<UserModel> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<UserModel>(`${this.apiUrl}/getUserById`, { params });
  }

  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/createUser`, user);
  }

  updateUser(id: number, user: UserModel): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.put<void>(`${this.apiUrl}/editUser`, user, { params });
  }

  deleteUser(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/deleteUser`, { params });
  }
}
