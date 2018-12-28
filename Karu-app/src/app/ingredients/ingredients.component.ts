import { Component, OnInit } from '@angular/core';
import { IngredientsService } from '../ingredients.service';
import {Ingredient } from '../ingredient';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {

  ingredients: Ingredient[];

  save(ingredient: Ingredient): void {
   this.ingredientsService.updateIngredient(ingredient)
     .subscribe();
 }
  
  getIngredients(): void {
	this.ingredientsService.getIngredients()
      .subscribe(ingredients => this.ingredients = ingredients);
  }
  
  add(name: string, price: number, scale: number): void {
	  
	  if(!name || !price ||  !scale){ return; }
	  
	  let ingredient: Ingredient = { name : name, price: price, scale: scale };
	  
	  /**  Estas 2 líneas hay que descomentarlas para enviar los datos del nuevo ingrediente
	       a la mongo!**/
	  this.ingredientsService.addIngredientMongo(ingredient)
      .subscribe();
	  
	  //this.ingredientsService.addIngredient(ingredient)
      //.subscribe(ingredient => this.ingredients.push(ingredient));
	  
  }
  
  delete(ingredient): void {
	  if(window.confirm('¿ Seguro que quiere eliminar este ingrediente ?')){
		  
		  this.ingredients = this.ingredients.filter(object => object != ingredient);
		  
		  /**  Estas 2 líneas hay que descomentarlas para eliminar los datos del ingrediente
	       de la mongo!**/
		  //this.ingredientsService.deleteIngredientMongo(ingredient)
          //.subscribe();
		  
		  this.ingredientsService.deleteIngredient(ingredient)
          .subscribe();
		  
		  
	  }
  }

  constructor(private ingredientsService: IngredientsService) { }

  ngOnInit() {
	  this.getIngredients();
  }

}
