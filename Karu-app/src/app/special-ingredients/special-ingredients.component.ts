import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import {Ingredient } from '../ingredient';
import { IngredientsService } from '../ingredients.service';
import { OrderService } from '../order.service';
import { ItemService } from '../item.service';
import { Order } from '../order';
import { Item } from '../item';
import { Price } from '../price';
@Component({
  selector: 'app-special-ingredients',
  templateUrl: './special-ingredients.component.html',
  styleUrls: ['./special-ingredients.component.css']
})

export class SpecialIngredientsComponent implements OnInit {

  //form: FormGroup;
  
  orderPrice: number = 0;
  
  receivingOrder: Order;
  
  ingredientsLoaded: Promise<boolean>;
  
  //ingredients: Ingredient[];
  //ingredientsAmounts: number[];
  ingredients: [Ingredient, any][] = [];
  
  newItems: Item[] = [];
  
  message:string;
  
  placeholderPrice: Price;
  
  labels = new Set();
  
  selected: string = "Todo";
  
  caja: boolean = false;
  
  /** Se obtiene la orden asociada a la rfid  y a la tablet **/
  getReceivingOrder(tabletId: number): void {
	tabletId = +tabletId
	console.log(typeof tabletId);
	if(typeof tabletId != "number"){ return }
	this.orderService.getOrders("M")
      .subscribe(
		orders => {
			this.caja = false;
			if(tabletId == 100){
				orders = orders.filter(o => o.ongoing == true);
				this.caja = true;
			}
			else{
				orders = orders.filter(o => o.receiving == tabletId);
			}
			if(orders.length != 1){ 
				return
			}
			this.receivingOrder = orders[0];
			this.orderPrice = this.receivingOrder.orderPrice;
			this.placeholderPrice = { name: "placeholder",
											price: this.orderPrice};
			console.log(this.orderPrice);
			console.log(this.placeholderPrice);
			this.updatePrice();
		}
	  );    
  }
  
  updateName(name: string): void {
	  console.log(name);
	  this.receivingOrder.name = name;
  }
  
  /** Se elimina el nuevo item de la lista provisoria **/
  removeItemFromReceivingOrder(item: Item): void{
		  var removedItem = this.newItems.filter(i => i == item);
		  if(removedItem.length==0 && this.caja == true){
			  removedItem = this.receivingOrder.items.filter(i => i == item);
			  this.receivingOrder.items  = this.receivingOrder.items.filter(i => i != item);
		  }
		  else{
			  this.newItems = this.newItems.filter(i => i != item); 
		  }  
		  this.orderPrice -= removedItem[0].itemPrice*removedItem[0].amount;	
		  this.updatePrice();
  }
 
  /** Se resta una unidad del item de la lista provisoria **/
  substractItem(object: [Ingredient, any]): void{
	 const ingredient = object[0];
	 const amount = object[1];
     if(this.receivingOrder != null){
		    
			const removedItem = this.newItems.filter(i => i.ingredient == ingredient.name);
			if(removedItem.length != 0){
				const decrement = ((object[1] > 1) ? 0.5 : 0.5);
				object[1] -= decrement;
				this.newItems = this.newItems.filter(i => i.ingredient != ingredient.name); 
				if(removedItem[0].amount == 0.5){
					this.orderPrice -= removedItem[0].itemPrice*decrement;
					this.updatePrice();
				}
				else{
					removedItem[0].amount -= decrement;
					this.newItems.push(removedItem[0]);
					this.orderPrice -= decrement*removedItem[0].itemPrice;
					this.updatePrice();
				}
			}
	  //const removedItem = this.newItems.filter(i => i.ingredient == ingredient.name);
	  
	}
  }
  
  addItem(object: [Ingredient, any]): void{
	 const ingredient = object[0];
	 const amount = object[1];
     if(this.receivingOrder != null){
			const increment = ( object[1] >= 1? 0.5 : 1);
			//if(object[1] >= 1){ increment = 0.5}
			object[1] += increment;
			const removedItem = this.newItems.filter(i => i.ingredient == ingredient.name);
			if(removedItem.length == 0){
				let newItem: Item = { itemPrice : ingredient.price,
									  amount : 1,
									  ingredient : ingredient.name
									};
				this.newItems.push(newItem);
				this.orderPrice += newItem.itemPrice;
				this.updatePrice();
			}
			else{
				removedItem[0].amount += increment;
				this.newItems = this.newItems.filter(i => i.ingredient != ingredient.name); 
				this.newItems.push(removedItem[0]);
				this.orderPrice += increment*removedItem[0].itemPrice;
				this.updatePrice();
			}
	}
  }
  
  
 
  /** Se agrega el ingrediente especial seleccionado a la orden, de forma provisoria **/
  /**
  addItemsToReceivingOrder(): void {
	  
	 const selectedIngredients = this.form.value.ingredients
			.map((v,i) => v ? this.ingredients[i] : null)
			.filter(v => v != null);
     if(this.receivingOrder != null && selectedIngredients.length != 0){
		for(var i = 0; i < selectedIngredients.length; i++){
			var found = false
			for(var j = 0; j < this.newItems.length; j++){
				if(this.newItems[j].ingredient == selectedIngredients[i].name){
					this.newItems[j].amount += 1;
					//this.newItems[j].itemPrice += selectedIngredients[i].price;
					found = true
					this.orderPrice += selectedIngredients[i].price;
					break;	
				}					
			}
			if(!found){
				let newItem: Item = { itemPrice : selectedIngredients[i].price,
									  amount : 1,
									  ingredient : selectedIngredients[i].name
									};
				//newItem.id = selectedIngredients[i].id;
				//newItem.itemPrice = selectedIngredients[i].price;
				//newItem.amount = 1;
				//newItem.ingredient = selectedIngredients[i].name;
				this.newItems.push(newItem);
				this.orderPrice += selectedIngredients[i].price;
				
			}
			//this.receivingOrder.items.push(newItem);
		}
		console.log(this.receivingOrder);
     }

  }
  **/
  updatePrice(): void {
	this.placeholderPrice.price = this.orderPrice;
	this.orderService.updatePrice(this.placeholderPrice)
	  .subscribe();
  }
  
  /** Se modifica la orden en la BD intermedia **/
  updateReceivingOrder(tabletId: number): void {
	  if(this.newItems.length != 0 && this.receivingOrder != null){
		  for(var i = 0; i < this.newItems.length; i++){
			  
			  var found = false
			  for(var j = 0; j < this.receivingOrder.items.length; j++){
					if(this.newItems[i].ingredient == this.receivingOrder.items[j].ingredient){
						console.log('asdasdas');
						this.receivingOrder.items[j].amount += 1;
						//this.newItems[j].itemPrice += selectedIngredients[i].price;
						found = true
						break;	
					}					
				}
			  if(!found){
				this.receivingOrder.items.push(this.newItems[i])	
			  }
		  }
	  }
	  this.receivingOrder.orderPrice = this.orderPrice;
	  console.log(this.receivingOrder);
	  this.orderService.updateOrder(this.receivingOrder)
	  .subscribe(
		order => {
			console.log(order);
			console.log(order == undefined);
			if( order != undefined ){
				this.getReceivingOrder(tabletId);
				this.newItems = [];
				for(var i=0; i < this.ingredients.length; i++){
					this.ingredients[i][1] = 0;
				}
			}
		}
	  );
	  
  }
  

  
  /** Se obtienen los ingredientes especiales a partir de la BD principal**/
  getSpecialIngredients(): void {
	
	this.ingredientsService.getIngredients("M")
      .subscribe(ingredients => {
		  ingredients = ingredients.filter(i => i.scale == -1);
		  
		  //this.ingredients = ingredients; 
		  for(var i=0; i < ingredients.length; i++){
			  this.labels.add(ingredients[i].label);
			  this.ingredients.push([ingredients[i],0]);
		  }
		  this.labels.add("Todo");
		  console.log(this.labels);
		  
		  //if(ingredients.length == 0){return;}
		  //const controls = this.ingredients.map(c => new FormControl(false));
		  //console.log(controls);
		  //controls[0].setValue(true);
		  //this.form = this.formBuilder.group({
		  //	ingredients: new FormArray(controls, minSelectedCheckboxes(1))
		//	});
		  //this.ingredientsLoaded = Promise.resolve(true);
		  });
	//this.ingredientsService.getIngredients("M")
	//	.subscribe(ingredients => this.middleIngredients = ingredients);

  }
  
  constructor(private ingredientsService: IngredientsService,
	private orderService: OrderService, private itemService: ItemService) { 
  }
  /**
  submit() {
	const selectedIngredientsIds = this.form.value.ingredients
			.map((v,i) => v ? this.ingredients[i].id : null)
			.filter(v => v != null);
    console.log(selectedIngredientsIds);
  }
  **/
  ngOnInit() {
	  this.getSpecialIngredients();
  }
}
/**
function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      // get a list of checkbox values (boolean)
      .map(control => control.value)
      // total up the number of checked checkboxes
      .reduce((prev, next) => next ? prev + next : prev, 0);

    // if the total is not greater than the minimum, return the error message
    return totalSelected >= min ? null : { required: true };
  };

  return validator;
}
**/

