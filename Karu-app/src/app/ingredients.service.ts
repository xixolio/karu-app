import { Injectable } from '@angular/core';
import { Ingredient } from './ingredient';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

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

  private ingredientsUrl = 'http://localhost:9090/http://127.0.0.1:8000/ingredient/';
  //private ingredientsUrl = 'http://192.168.0.200:9090/http://192.168.0.200:8000/ingredient/'
  private mongoIngredientsUrl = 'http://192.168.0.210:80/';/** modificar por ip de la mongo **/

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
	
  /** Consulta GET para obtener todos los ingredientes desde la DB principal **/
  getIngredients(): Observable<Ingredient[]> {
	  
	  return this.http.get<Ingredient[]>(this.ingredientsUrl,httpOptions)
	  	.pipe(
	  		catchError(this.handleError('getIngredients', []))
		);
  }	
  
  /** Consulta PUT para modificar el precio y la pesa del ingrediente en ambas bases de datos */
  updateIngredient (ingredient: Ingredient): Observable<any> {
	
	const url = `${this.ingredientsUrl}${ingredient.id}/`;
	return this.http.put(url, ingredient, httpOptions).pipe(
		tap(_ => this.log(`updated ingredient id=${ingredient.id}`)),
		catchError(this.handleError<any>('updateIngredient'))
  );
  }
  
  /** Consulta POST para agregar ingrediente en la DB principal**/
  addIngredient(ingredient: Ingredient): Observable<Ingredient> {

	  return this.http.post<Ingredient>(this.ingredientsUrl, ingredient, httpOptions).pipe(
		catchError(this.handleError<Ingredient>('addIngredient'))
	  );
  }
  /** Consulta POST para agregar ingrediente en la Mongo**/
  /** Eliminar httpOptions si no es necesaria la información de usuario o construir un
	  httpOptions2 en caso de necesitarse otro nombre de usuario y contraseña **/
  addIngredientMongo(ingredient: Ingredient): Observable<Ingredient> {

	  return this.http.post<Ingredient>(this.mongoIngredientsUrl, ingredient, httpOptions).pipe(
		catchError(this.handleError<Ingredient>('addIngredient'))
	  );
  }
  
  deleteIngredient(ingredient: Ingredient): Observable<Ingredient> {

	  return this.http.post<Ingredient>(this.mongoIngredientsUrl, ingredient, httpOptions).pipe(
		catchError(this.handleError<Ingredient>('addIngredient'))
	  );
  }
  
  

  
  constructor(private http: HttpClient) {	  
		
  }
}