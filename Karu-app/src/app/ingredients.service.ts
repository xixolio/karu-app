import { Injectable } from '@angular/core';
import { Ingredient } from './ingredient';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GlobalVariable } from './global';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json',
								'Authorization': 'Basic ' + btoa("username:odolwa14")
								})
  };

@Injectable({
  providedIn: 'root'
})
/** Este servicio se encarga de manejar la información de los ingredientes.
 Cuando se actualiza la información de un ingrediente, se debe actualizar
 tanto la DB principal como la MongoDB. Por ende, se utilizan dos IPs, las 
 cuales se deben modificar apropiadamente más abajo (ingredientsUrl es la de la
 DB principal y mongoIngredientsUrl es la de la mongoDB.

 Los campos de un ingrediente son:
 id: number - la id del ingrediente
 price: number - el precio del ingrediente
 name: string - el nombre del ingrediente

 Se debe notar que la diferencia entre el price del ingrediente y el del item
 es que el del item no debe modificarse, ya que corresponde al precio que tenía
 el ingrediente en el momento en que se realizó la compra. **/

export class IngredientsService {


  //private ingredientsUrl = 'http://localhost:9090/http://127.0.0.1:8000/ingredient/';
  //private ingredientsUrl = 'http://192.168.0.200:9090/http://192.168.0.200:8000/ingredient/'
  //private mongoIngredientsUrl = 'http://192.168.0.210:80/';/** modificar por ip de la mongo **/
  private backendUrl = GlobalVariable.BASE_API_URL + 'ingredient/';
  private middleUrl = GlobalVariable.MIDDLE_API_URL + 'ingredient/';

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
	
  /** Consulta GET para obtener ingredientes **/
  getIngredients(db: string): Observable<Ingredient[]> {
	  
	  var url;
	  if( db == 'B' ){url = this.backendUrl}
	  if( db == 'M' ){url = this.middleUrl}  
	  
	  return this.http.get<Ingredient[]>(url,httpOptions)
	  	.pipe(
	  		catchError(this.handleError('getIngredients', []))
		);
  }	
  
  getIngredient(ingredient: Ingredient, db: string): Observable<Ingredient> {
	  
	  var url;
	  if( db == 'B' ){url = this.backendUrl}
	  if( db == 'M' ){url = this.middleUrl}  
	  
	  const url_id = `${url}${ingredient.id}/`;
	  return this.http.get<Ingredient>(url_id,httpOptions)
	  	.pipe(
	  		catchError(this.handleError<Ingredient>('getIngredient'))
		);
  }	
  
  /** Consulta PUT para modificar el precio y la pesa del ingrediente en ambas bases de datos */
  updateIngredient (ingredient: Ingredient, db: string): Observable<Ingredient> {
	
	var url;
	if( db == 'B' ){url = this.backendUrl}
	if( db == 'M' ){url = this.middleUrl}
	  
	const url_id = `${url}${ingredient.id}/`;
	return this.http.put<Ingredient>(url_id, ingredient, httpOptions).pipe(
		tap(_ => this.log(`updated ingredient id=${ingredient.id}`)),
		catchError(this.handleError<Ingredient>('updateIngredient'))
  );
  }
  
  /** Consulta POST para agregar ingredientes**/
  addIngredient(ingredient: Ingredient, db: string): Observable<Ingredient> {
	  var url;
	  if( db == 'B' ){url = this.backendUrl}
	  if( db == 'M' ){url = this.middleUrl}
	  console.log(ingredient.id);
	  return this.http.post<Ingredient>(url, ingredient, httpOptions).pipe(
		catchError(this.handleError<Ingredient>('addIngredient'))
	  );
  }
  // /** Consulta POST para agregar ingrediente en la Mongo**/
  // /** Eliminar httpOptions si no es necesaria la información de usuario o construir un
	  // httpOptions2 en caso de necesitarse otro nombre de usuario y contraseña **/
  // addIngredientMongo(ingredient: Ingredient): Observable<Ingredient> {

	  // return this.http.post<Ingredient>(this.mongoIngredientsUrl, ingredient, httpOptions).pipe(
		// catchError(this.handleError<Ingredient>('addIngredient'))
	  // );
  // }
  
  deleteIngredient(ingredient: Ingredient, db): Observable<Ingredient> {

	var url;
	if( db == 'B' ){url = this.backendUrl}
	if( db == 'M' ){url = this.middleUrl}
	  
	const url_id = `${url}${ingredient.id}/`;
	const url_id = `${url}${ingredient.id}/`;
	
	 return this.http.delete<Ingredient>(url_id, httpOptions).pipe(
		catchError(this.handleError<Ingredient>('deleteIngredient'))
	  );
	//	catchError(this.handleError<Ingredient>('addIngredient'))
//  );
  }
  
  

  
  constructor(private http: HttpClient) {	  
		
  }
}