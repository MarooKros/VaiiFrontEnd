import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { LogginModel } from "../Models/LogginModel";
import { UserModel } from "../Models/UserModel";

@Injectable({
  providedIn: 'root'
})
export class LogginService {
  private apiUrl = 'https://localhost:7295/api/loggin';
  private loginSubject = new Subject<UserModel>();

  constructor(private http: HttpClient) {}

  getLoggedInUser(): Observable<UserModel> {
    return this.http.get<LogginModel>(`${this.apiUrl}/getLoggedUser`).pipe(
      map(logginModel => ({
        id: logginModel.user.id,
        name: logginModel.user.name,
        password: logginModel.user.password
      }))
    );
  }

  logInUser(user: UserModel): Observable<UserModel> {
    return this.http.post<LogginModel>(`${this.apiUrl}/logInUser`, user).pipe(
      map(logginModel => {
        const loggedInUser = {
          id: logginModel.user.id,
          name: logginModel.user.name,
          password: logginModel.user.password
        };
        this.loginSubject.next(loggedInUser);
        return loggedInUser;
      })
    );
  }

  logOutUser(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/logOutUser`);
  }

  getLoginObservable(): Observable<UserModel> {
    return this.loginSubject.asObservable();
  }
}
