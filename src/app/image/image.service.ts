import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = environment.imageUrl;

  constructor(private http: HttpClient) {}

  generateImage(prompt: string): Observable<string> {
    return this.http.post<{ image: string }>(this.apiUrl, { prompt: prompt }, { responseType: 'json' })
      .pipe(map(response => response.image));
  }
}