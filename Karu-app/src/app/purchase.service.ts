import { Injectable } from '@angular/core';
import { Order } from './order';
import { Item } from './item';
import { Purchase } from './purchase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalVariable } from './global';

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

  //private purchaseUrl = 'http://localhost:9090/http://127.0.0.1:8000/purchase/';
  //private purchaseUrl = 'http://192.168.0.200:9090/http://192.168.0.200:8000/purchase/';
  private backendUrl = GlobalVariable.BASE_API_URL + 'purchase/';
  private middleUrl = GlobalVariable.MIDDLE_API_URL + 'purchase/';
  
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
	
  getPurchases(): Observable<Purchase[]> {
	  
	  var url = this.middleUrl;  
	  
	  return this.http.get<Purchase[]>(url,httpOptions)
	  	.pipe(
	  		catchError(this.handleError('getPurchases', []))
		);
  }	
  /** Función que agrega la compra a la base de datos final **/
  addPurchase(purchase: Purchase, db: string): Observable<Purchase> {
	  var url;
	  if( db == 'B' ){url = this.backendUrl}
	  if( db == 'M' ){url = this.middleUrl}
	  
	  return this.http.post<Purchase>(url, purchase, httpOptions).pipe(
		catchError(this.handleError<Purchase>('addPurchase'))
	  );
  }
  
  updatePurchase(purchase: Purchase): Observable<Purchase> {
	  
	  const url_id = `${this.middleUrl}${purchase.id}/`;
	  return this.http.put<Purchase>(url_id, purchase, httpOptions).pipe(
		catchError(this.handleError<Purchase>('updatePurchase'))
	  );
  }
  
  // getPurchases(): Observable<Purchase[]> {
	  
	  // return this.http.get<Purchase[]>(this.purchaseUrl,httpOptions)
	  	// .pipe(
	  		// catchError(this.handleError('addPurchase', []))
		// );
  // }	
	
  constructor(private http: HttpClient) { }
}
