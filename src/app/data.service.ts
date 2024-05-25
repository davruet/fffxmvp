import { Injectable } from '@angular/core';
import { HttpClient, HttpDownloadProgressEvent, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from '../environments/environment'; // Import environment


@Injectable({
  providedIn: 'root',
})
export class DataService {
	
private triggerGenerateRecipe = new Subject<string>();

  constructor(private http: HttpClient) {}

  // Observable to be triggered from another component
  getGenerateRecipeTrigger(): Observable<string> {
    return this.triggerGenerateRecipe.asObservable();
  }

  // Method to be called to trigger the fetchData
  generateRecipe(json:string) {
    this.triggerGenerateRecipe.next(json);
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
  
    /**
   * Send an email with the provided address and recipe ID.
   * @param address The email address to which the email will be sent.
   * @param recipeId The ID of the recipe to include in the email.
   * @returns Observable of the HTTP response.
   */
    sendEmail(address: string, recipeId: string): Observable<any> {
      const url = environment.emailUrl;  // Update with your actual API endpoint
      const body = { email: address, recipeId: recipeId };
      return this.http.post(url, body);
    }
}