import { Injectable } from '@angular/core';
import { Order } from './order';
import { Item } from './item';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalVariable } from './global';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json',
								'Authorization': 'Basic ' + btoa("username:odolwa14")
								})
  };
  /** Este servicio se encarga de manejar la información de las compras (que es un sandwich).
  La consulta GET se realiza a la mongo, para obtener las compras en particular
  asociadas a la RFID que puso el cajera, mientras que la consulta POST se realiza a la
  Django DB. La variable ordersDBUrl tiene la información de la ip de la API Django, y la
  ordersMongoDB la de la mongo, por lo cual, esta última debe ser modificada apropiadamente.
 
 Los campos de una compra (order) son:
 id: number
 items: Item[] - la lista con Items (ingredientes de un sandwich) del sandwich
 cardId: number - el número de la RFID
 
 Los campos de un Item (que es un ingrediente de un sandwich) son:
 id: number
 itemPrice: number - el precio con el que se realizó el pesaje
  amount: number - la cantidad de gramos del ingrediente
  ingredient: string - el nombre del ingrediente asociado
  
  Notar que este último es diferente a ingredient, ya que es el ingrediente agregado al sandwich.

  **/

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  //private ordersDBUrl = 'http://localhost:9090/http://127.0.0.1:8000/order/';
  //private ordersDBUrl = 'http://192.168.0.200:9090/http://192.168.0.200:8000/order/';
  
  /** Esta URL se debe modificar por la de la Mongo DB**/
  //private ordersMongoDB = 'http://192.168.0.200:9090/http://192.168.0.200:8000/order/3/';
  //private ordersMongoDB = 'http://localhost:9090/http://127.0.0.1:8000/order/3/';
  
  private backendUrl = GlobalVariable.BASE_API_URL + 'order/';
  private middleUrl = GlobalVariable.MIDDLE_API_URL + 'order/';
  
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

/** No se usa por ahora **/
  getOrders(db: string): Observable<Order[]> {
	  
	  var url;
	  if( db == 'B' ){url = this.backendUrl}
	  if( db == 'M' ){url = this.middleUrl}  
	  
	  return this.http.get<Order[]>(url,httpOptions)
	  	.pipe(
	  		catchError(this.handleError('getOrders', []))
		);
  }	
  

  getOngoingOrder(): Observable<Order> {
	  
	  return this.http.get<Order>(this.backendUrl,httpOptions)
	  	.pipe(
	  		catchError(this.handleError<Order>('getOngoingOrder'))
		);
  }	
  
  deleteOrder(order: Order): Observable<Order> {
	  
	  const url_id = `${this.middleUrl}${order.id}/`;
	  
	  return this.http.delete<Order>(url_id, httpOptions).pipe(
		catchError(this.handleError<Order>('deleteOrder'))
	  );
  }
  
  
  
  
  constructor(private http: HttpClient) { }
}
