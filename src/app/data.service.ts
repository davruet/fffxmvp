import { Injectable } from '@angular/core';
import { HttpClient, HttpDownloadProgressEvent, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from '../environments/environment'; // Import environment


@Injectable({
  providedIn: 'root',
})
export class DataService {
	
private triggerGenerateRecipe = new Subject<void>();

  constructor(private http: HttpClient) {}

  // Observable to be triggered from another component
  getGenerateRecipeTrigger(): Observable<void> {
    return this.triggerGenerateRecipe.asObservable();
  }

  // Method to be called to trigger the fetchData
  generateRecipe() {
    this.triggerGenerateRecipe.next();
  }

  postRecipe(body:any): Observable<string> {
    let lastLen: number = 0;
    return this.http.post(environment.generateUrl,
		body, {
      observe: 'events',
      responseType: 'text',
      reportProgress: true
    }).pipe(
      filter(event => event.type === HttpEventType.DownloadProgress),
      map(event => {
          const downloadEvent = event as HttpDownloadProgressEvent;
              // Extract the partial text from the event if it exists
              const prevLen: number = lastLen;
              if (downloadEvent.partialText){
                lastLen = downloadEvent.partialText.length;
                return downloadEvent.partialText.slice(prevLen);
              } else {
                return "";
              }
            }
          )
    );
  }
}