import { Injectable } from '@angular/core';
import { Order } from './order';
import { Item } from './item';
import { Purchase } from './purchase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

/** Acá se realiza el POST a la Base de datos. No debería necesitar modificarse nada **/
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json',
								'Authorization': 'Basic ' + btoa("username:odolwa14")
								})
  };
  
@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private purchaseUrl = 'http://localhost:9090/http://127.0.0.1:8000/purchase/';
  
  
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
	
  addPurchase(purchase: Purchase): Observable<Purchase> {
	  return this.http.post<Purchase>(this.purchaseUrl, purchase, httpOptions).pipe(
		catchError(this.handleError<Purchase>('addPurchase'))
	  );
  }
	
  constructor(private http: HttpClient) { }
}
