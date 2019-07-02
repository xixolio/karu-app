import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import {Ingredient } from '../ingredient';
import { IngredientsService } from '../ingredients.service';
import { OrderService } from '../order.service';
import { PurchaseService } from '../purchase.service';
import { ItemService } from '../item.service';
import { Order } from '../order';
import { Item } from '../item';
import { Price } from '../price';
import { Purchase } from '../purchase';
@Component({
  selector: 'app-special-ingredients',
  templateUrl: './special-ingredients.component.html',
  styleUrls: ['./special-ingredients.component.css']
})

export class SpecialIngredientsComponent implements OnInit {

  //form: FormGroup;
  
  orderPrice: number = 0;
  purchasePrice: number = 0;
  
  purchases: Purchase[];
  
  receivingOrder: Order;
  
  receivingPurchase: Purchase;
  
  ingredientsLoaded: Promise<boolean>;
  
  //ingredientsAmounts: number[]; 
  //ingredients: Ingredient[];
  
  ingredients: [Ingredient, any][] = [];
  
  newItems: Item[] = [];
  
  message:string;
  
  placeholderPrice: Price;
  
  labels = new Set();
  
  selected: string = "Todo";
  
  caja: boolean = false;
  
  /** Se obtiene la orden asociada a la rfid  y a la tablet **/
  createPurchase(): void {
	  
	  let orders: Order[] = [];
	  let items: Item[] = [];
	  let order: Order = { items: items,
						   orderPrice: 0,
						   name: 'sandwich 1'};
	  orders.push(order);
	  
	  let purchase: Purchase = { orders: orders,
								 totalPrice : 0};
	  console.log(purchase);
	  this.purchaseService.addPurchase(purchase, 'M')
		.subscribe( purchase => {
					this.receivingPurchase = purchase;
					this.receivingOrder = purchase.orders[purchase.orders.length-1];
					this.orderPrice = 0;
					this.purchasePrice = 0;
					this.purchases.push(purchase);
					});
  }
  createOrder(): void {
	  let items: Item[] = [];
	  const amountOrders = (this.receivingPurchase.orders.length+1) as any as string;
	  
	  let order: Order = { items: items,
						   orderPrice: 0,
						   name: "sandwich "+amountOrders};
	  this.receivingPurchase.orders.push(order);
	  this.purchaseService.updatePurchase(this.receivingPurchase)
		.subscribe( purchase => {
								 if(purchase==undefined){return;}
								 var i = this.purchases.indexOf(this.receivingPurchase);
								 this.purchases[i] = purchase;
								 this.receivingPurchase = purchase;
								 console.log(purchase);
								 this.receivingOrder = purchase.orders[purchase.orders.length-1];
								 console.log(this.receivingOrder);
								 this.orderPrice = 0;
								 });
  }
  selectReceivingOrder(): void{
	  
  }
  
  selectOrder (order: Order): void{
		this.receivingOrder = order;
		this.orderPrice = order.orderPrice;
		this.purchasePrice = this.receivingPurchase.totalPrice;
		this.newItems = [];
		for(var i=0; i < this.ingredients.length; i++){
					this.ingredients[i][1] = 0;
		}
	}
	
  selectPurchase (purchase: Purchase): void{
		this.receivingPurchase = purchase;
		this.purchasePrice = this.receivingPurchase.totalPrice;	
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
					this.purchasePrice -= removedItem[0].itemPrice*decrement;
					//this.updatePrice();
				}
				else{
					removedItem[0].amount -= decrement;
					this.newItems.push(removedItem[0]);
					this.orderPrice -= decrement*removedItem[0].itemPrice;
					this.purchasePrice -= decrement*removedItem[0].itemPrice;
					//this.updatePrice();
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
				this.purchasePrice += newItem.itemPrice;
				//this.updatePrice();
			}
			else{
				removedItem[0].amount += increment;
				this.newItems = this.newItems.filter(i => i.ingredient != ingredient.name); 
				this.newItems.push(removedItem[0]);
				this.orderPrice += increment*removedItem[0].itemPrice;
				this.purchasePrice += increment*removedItem[0].itemPrice;
				//this.updatePrice();
			}
	}
  }
  
  /** Se modifica la orden en la BD intermedia **/
  updateReceivingOrder(): void {
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
	  this.receivingPurchase.totalPrice = this.purchasePrice;
	  console.log(this.receivingOrder);
	  this.orderService.updateOrder(this.receivingOrder)
	  .subscribe(
		order => {
			console.log(order);
			console.log(order == undefined);
			if( order != undefined ){
				window.confirm("Compra guardada con éxito!")
				this.receivingOrder = order;
				this.newItems = [];
				for(var i=0; i < this.ingredients.length; i++){
					this.ingredients[i][1] = 0;
				}
			}
			else{
				window.confirm("Ocurrió un problema, intente denuevo :(")
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
  
  getPurchases(): void {
	this.purchaseService.getPurchases()
      .subscribe(purchases => this.purchases = purchases);
  }
  
  constructor(private ingredientsService: IngredientsService,
    private purchaseService: PurchaseService,
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
	  this.getPurchases();
  }
}


