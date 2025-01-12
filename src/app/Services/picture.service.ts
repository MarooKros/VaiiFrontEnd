import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PictureModel } from '../Models/PictureModel';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private apiUrl = 'https://localhost:7295/api/pictures';

  constructor(private http: HttpClient) {}

  createPicture(picture: PictureModel): Observable<PictureModel> {
    return this.http.post<PictureModel>(`${this.apiUrl}/createPicture`, picture);
  }

  getPictureById(id: number): Observable<PictureModel> {
    return this.http.get<PictureModel>(`${this.apiUrl}/getPictureById/${id}`);
  }

  getAllPictures(): Observable<PictureModel[]> {
    return this.http.get<PictureModel[]>(`${this.apiUrl}/getAllPictures`);
  }

  deletePicture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletePicture/${id}`);
  }
}
