import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import {Ingredient } from '../ingredient';
import { IngredientsService } from '../ingredients.service';
import { OrderService } from '../order.service';
import { Order } from '../order';
import { Item } from '../item';

@Component({
  selector: 'app-plan-b',
  templateUrl: './plan-b.component.html',
  styleUrls: ['./plan-b.component.css']
})
export class PlanBComponent implements OnInit {

  form: FormGroup;
  
  orderPrice: number = 0;
  
  receivingOrder: Order;
  
  ingredientsLoaded: Promise<boolean>;
  
  ingredients: Ingredient[];
  
  newItems: Item[] = [];
  
  message:string;
  
  /** Se obtiene la orden asociada a la rfid  y a la tablet **/
  getReceivingOrder(tabletId: number): void {
	tabletId = +tabletId
	console.log(typeof tabletId);
	if(typeof tabletId != "number"){ return }
	this.orderService.getOrders("M")
      .subscribe(
		orders => {
			orders = orders.filter(o => o.receiving == tabletId);
			if(orders.length != 1){ return }
			this.receivingOrder = orders[0];
			this.orderPrice = this.receivingOrder.orderPrice;
			console.log(this.orderPrice);
		}
	  );    
  }
  
  /** Se elimina el nuevo item de la lista provisoria **/
  removeItemFromReceivingOrder(item: Item): void{
		  const removedItem = this.newItems.filter(i => i == item);
		  this.newItems = this.newItems.filter(i => i != item); 
		  this.orderPrice -= removedItem[0].itemPrice*removedItem[0].amount;
  }
 
  /** Se agrega el ingrediente especial seleccionado a la orden, de forma provisoria **/
  addItemToReceivingOrder(): void {
	  
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
	  this.receivingOrder.orderPrice = this.orderPrice;
	  this.orderService.updateOrder(this.receivingOrder)
	  .subscribe(
		order => {
			console.log('aca');
			this.getReceivingOrder(tabletId);
			if( order != null ){
				this.newItems = [];
			}
		}
	  );
	  }
  }
  
  
  /** Se obtienen los ingredientes especiales a partir de la BD principal**/
  getIngredients(): void {
	
	this.ingredientsService.getIngredients("B")
      .subscribe(ingredients => {
		  ingredients = ingredients.filter(i => i.scale != -1);
		  this.ingredients = ingredients; 
		  if(ingredients.length == 0){return;}
		  const controls = this.ingredients.map(c => new FormControl(false));
		  console.log(controls);
		  controls[0].setValue(true);
		  this.form = this.formBuilder.group({
			ingredients: new FormArray(controls, minSelectedCheckboxes(1))
			});
		  this.ingredientsLoaded = Promise.resolve(true);
		  });
	//this.ingredientsService.getIngredients("M")
	//	.subscribe(ingredients => this.middleIngredients = ingredients);

  }
  
  constructor(private formBuilder: FormBuilder, private ingredientsService: IngredientsService,
  private orderService: OrderService) { 
  }
  
  submit() {
	const selectedIngredientsIds = this.form.value.ingredients
			.map((v,i) => v ? this.ingredients[i].id : null)
			.filter(v => v != null);
    console.log(selectedIngredientsIds);
  }
  
  ngOnInit() {
	  this.getIngredients();
	  this.orderService.currentMessage.subscribe(message => this.message = message)
  }

}

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
