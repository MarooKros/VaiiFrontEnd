import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IssueModel } from '../Models/IssueModel';



@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = 'https://localhost:7295/api/issue';

  constructor(private http: HttpClient) {}

  getIssues(): Observable<IssueModel[]> {
    return this.http.get<IssueModel[]>(`${this.apiUrl}/getIssues`);
  }

  getIssueById(id: number): Observable<IssueModel> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<IssueModel>(`${this.apiUrl}/getIssueById`, { params });
  }

  createIssue(issue: IssueModel): Observable<IssueModel> {
    return this.http.post<IssueModel>(`${this.apiUrl}/createIssue`, issue);
  }

  updateIssue(id: number, issue: IssueModel): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.put<void>(`${this.apiUrl}/editIssue`, issue, { params });
  }

  deleteIssue(id: number): Observable<void> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<void>(`${this.apiUrl}/deleteIssue`, { params });
  }
}
