import { Component, OnInit } from '@angular/core';
import { IngredientsService } from '../ingredients.service';
import {Ingredient, IngredientShow, IngredientVisual } from '../ingredient';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})



export class IngredientsComponent implements OnInit {

  ingredientsVisual: {[scale: number]: IngredientVisual; } = {};
  ingredients: Ingredient[];
  middleIngredients: Ingredient[];
  visibleIngredients: IngredientShow[] = [];
 
  save(ingredient: Ingredient): void {
   this.ingredientsService.updateIngredient(ingredient, 'B')
     .subscribe(ingredient => {
		 if(ingredient != undefined){
			 this.ingredientsService.updateIngredient(ingredient, 'M')
				.subscribe()
		 }
	 });
 }
 
 deleteIngredient(ingredient: Ingredient): void {
   this.ingredientsService.deleteIngredient(ingredient, 'M')
     .subscribe(ingredient => {
		 if(typeof(ingredient) == null){
			 this.ingredientsService.deleteIngredient(ingredient, 'B')
				.subscribe(_ => console.log('logrado'))
		 }
	 });
 }
  
  // Gets ingredients from both BDs and creates a visible element that shows
  // the price at both bds, the name and scale of the ingredient.
  getIngredients(): void {
	
	this.ingredientsService.getIngredients("B")
      .subscribe(ingredients => {
		  this.ingredients = ingredients; 
		  });
	//this.ingredientsService.getIngredients("M")
	//	.subscribe(ingredients => this.middleIngredients = ingredients);

  }
  
  // updateDictionary(): void{

	// console.log(this.ingredients);
	// for(var i = 0; i <= 15; i++){		
		// this.ingredientsVisual[i] = {name : "None", backendPrice : 0, middlePrice :0 };		
	// }
	
	// for(var i = 0; i < this.ingredients.length; i++){		
		
		// var s = this.ingredients[i].scale;
		// var n = this.ingredients[i].name;
		// var p = this.ingredients[i].price;
		// this.ingredientsVisual[s].name = n;
		// this.ingredientsVisual[s].backendPrice = p;
	// }	  
	
	// for(var i = 0; i <= 15; i++){
		// var n = this.ingredientsVisual[i].name
		// var p = this.ingredientsVisual[i].backendPrice
		// var mp = this.ingredientsVisual[i].middlePrice
		// let ingredient: Ingredient = {scale : i, name: n, backendPrice: p, middlePrice: mp};
		// this.visibleIngredients.push(ingredient);
	// }
	
	// console.log(this.visibleIngredients);
	
  // }
  
  synchronize(ingredient: Ingredient): void {
	  
	  this.ingredientsService.getIngredient(ingredient,"B")
		.subscribe(response => {
			// If the ingredient doesnt exist in the backend DB, delete it from the middle
			if(response == undefined) {
				this.ingredientsService.deleteIngredient(ingredient,'M');
			}
			// Otherwise, either add or update in the middle.
			else{
			  this.ingredientsService.getIngredient(ingredient,"M")
				.subscribe(response => {		
					// If the ingredient doesnt exist in the middle DB, create it
					if(response == undefined){
						this.ingredientsService.addIngredient(ingredient,'M')
						.subscribe();
					}
					// otherwise, update its content based on the content on the backend
					else{
						this.ingredientsService.updateIngredient(ingredient,'M')
						.subscribe();
					}		
				});
			}
		}
		)
  }
  
  checkSynchronized(ingredient: Ingredient): void {
	  
	  this.ingredientsService.getIngredients("M")
		.subscribe(ingredients => this.middleIngredients = ingredients);
	  
  }
  
  add(name: string, price: number, scale: number): void {
	  
	  if(!name || !price ||  !scale){ return; }
	  
	  let ingredient: Ingredient = { name : name, price: price, scale: scale };
		   
	  this.ingredientsService.addIngredient(ingredient,'B')
      .subscribe(ingredient => {
	  this.ingredients.push(ingredient);
	  this.ingredientsService.addIngredient(ingredient,'M')
		.subscribe();
	  });  
  }
  
  constructor(private ingredientsService: IngredientsService) { }

  ngOnInit() {
	  this.getIngredients();
  }

}
