import { Injectable } from '@angular/core';
import { GlobalVariable } from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { KitchenItem } from './item';
import { Message } from './message';

 const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json',
								'Authorization': 'Basic ' + btoa("username:odolwa14")
								})
  };
@Injectable({
  providedIn: 'root',
})
export class ItemService {
  
   private backendUrl = GlobalVariable.BASE_API_URL + 'kitchenItem/';
   private middleUrl = GlobalVariable.MIDDLE_API_URL + 'kitchenItem/';

   private messagesMiddleUrl = GlobalVariable.MIDDLE_API_URL + 'messages/';
   
   private log(message: string) {	
  }
  
  private handleError<T> (operation = 'operation', result?: T) {
	return (error: any): Observable<T> => {
	 
		// TODO: send the error to remote logging infrastructure
		console.error(error); // log to console instead
	 
		// TODO: better job of transforming error for user consumption
		this.log(`${operation} failed: ${error.message}`);
	 
		// Let the app keep running by returning an empty result.
		return of(result as T);
	  };
	}
	
   getKitchenItems(): Observable<KitchenItem[]>{
	  const url = this.middleUrl;
	  
	  return this.http.get<KitchenItem[]>(url,httpOptions)
	  	.pipe(
	  		catchError(this.handleError('getKitchenItems', []))
		);
   }
   
   updateKitchenItem(kitchenItem: KitchenItem): Observable<KitchenItem>{
	  const url_id = `${this.middleUrl}${kitchenItem.id}/`;
	  
	  return this.http.put<KitchenItem>(url_id,kitchenItem,httpOptions)
	  	.pipe(
	  		catchError(this.handleError<KitchenItem>('updateKitchenItem'))
		);
   }
   
   deleteKitchenItem(kitchenItem: KitchenItem): Observable<KitchenItem>{
	  const url_id = `${this.middleUrl}${kitchenItem.id}/`;
	  
	  return this.http.delete<KitchenItem>(url_id,httpOptions)
	  	.pipe(
	  		catchError(this.handleError<KitchenItem>('deleteKitchenItem'))
		);
   }
   
   getMessages(): Observable<Message[]>{
	  const url = this.messagesMiddleUrl;
	  
	  return this.http.get<Message[]>(url,httpOptions)
	  	.pipe(
	  		catchError(this.handleError('getMessages', []))
		);
   }
   
   sendMessage(message: Message): Observable<Message> {
	   const url = this.messagesMiddleUrl;
	   return this.http.post<Message>(url, message, httpOptions).pipe(
		catchError(this.handleError<Message>('sendMessages'))
	  );
   }
   
   constructor(private http: HttpClient) {	  
		
  }
}
