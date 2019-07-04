import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { PurchaseService } from '../purchase.service';
import { Order } from '../order';
import { Purchase } from '../purchase';
import { Item } from '../item';


@Component({
  selector: 'app-ongoing-order',
  templateUrl: './ongoing-order.component.html',
  styleUrls: ['./ongoing-order.component.css']
})

export class OngoingOrderComponent implements OnInit {

  //ongoingOrders: Order[] = [];
  purchases: Purchase[];
  purchasePrice: number = 0;
  updates: number[]= [];
  editar: number = 0;
  statusOptions: number[] = [0,1];

  // Falta agregar mensajes
  // 1) Si el get obtuvo un objeto, avisar
  // 2) Si el get no obtuvo nada, avisar también
  
  getPurchases(): void {
	  this.purchaseService.getPurchases()
      .subscribe(purchases => {
		  this.purchases = purchases;
		  for(var i=0; i< this.purchases.length; i++){
			  console.log('aca');
			  this.updates.push(0);
		  }
	  });
  }
  
  // updatePrices(): void{
	  
	  // this.purchasePrice = 0;

	  // for(var i = 0; i < this.ongoingOrders.length; i++){
		  
		  // this.ongoingOrders[i].orderPrice = 0;
		  
		  // for(var j = 0; j < this.ongoingOrders[i].items.length; j++){
				// this.ongoingOrders[i].orderPrice += this.ongoingOrders[i].items[j].itemPrice*this.ongoingOrders[i].items[j].amount;			
		  // }		

		  // this.purchasePrice += this.ongoingOrders[i].orderPrice;
	  // }
	  
  // }
  
  // removeOrderItem(order,item): void {
	  
    // for(var i = 0; i < this.ongoingOrders.length; i++){
	  
	  // if(this.ongoingOrders[i] == order){
		 
		 // this.ongoingOrders[i].orderPrice -= item.itemPrice*item.itemAmount;
		 // this.ongoingOrders[i].items = this.ongoingOrders[i].items.filter(object => object != item);
		 
		// /* for(var j = 0; i < this.ongoingOrders[i].items.length; j++){
				// if(item == this.ongoingOrders[i].items[j]){
					
				// }
			// }*/
		 // if (!this.ongoingOrders[i].items[0]){
			 // this.ongoingOrders = this.ongoingOrders.filter(object => object != this.ongoingOrders[i]);
		 // }
		 
		// } 
	// }
	
	// this.updatePrices();
	
  // }
  
  
  // Falta Mensajito de que la compra fue agregada jeje
  /*
  addPurchase(): void {
	  
	if( !this.ongoingOrders[0]) { return;} 
	if(!window.confirm("¿Desea finalizar la compra?")) { return;}
	let purchase: Purchase = { orders : this.ongoingOrders};

	this.purchaseService.addPurchase(purchase)
		.subscribe(purchase => {
			if(purchase != undefined){
				
				for(var i=0; i< this.ongoingOrders.length; i++){
					this.deleteOrder(this.ongoingOrders[i]);
				}
				this.ongoingOrders = [];
				this.purchasePrice = 0;
			}
		});
	
  }  
  */
  addPurchase(purchase: Purchase): void {
	  this.purchaseService.addPurchase(purchase,'B')
	  .subscribe(rpurchase => this.purchases = this.purchases.filter(p => p != purchase));
  }
  
  deleteItem(item: Item, order: Order, purchase: Purchase): void {
	  var i = this.purchases.indexOf(purchase);
	  var j = this.purchases[i].orders.indexOf(order);
	  this.purchases[i].orders[j].items = this.purchases[i].orders[j].items.filter(it => it != item);
	  const difference = item.itemPrice*item.amount;
	  this.purchases[i].orders[j].orderPrice -= difference;
	  this.purchases[i].totalPrice -= difference;
	  this.updates[i] = 1;
  }
  
  deleteOrder(order: Order, purchase: Purchase): void {
	  var i = this.purchases.indexOf(purchase);
	  this.purchases[i].orders = this.purchases[i].orders.filter(o => o != order);
	  const difference = order.orderPrice;
	  this.purchases[i].totalPrice -= difference;
	  this.updates[i] = 1;
  }
  
  updatePurchase(purchase: Purchase): void {
	  var i = this.purchases.indexOf(purchase);
	  this.purchaseService.updatePurchase(purchase)
		.subscribe( upPurchase => {
					this.purchases[i] = upPurchase;
					this.updates[i] = 0;
					});  
  }
  
  finishDay(): void {
	  const lastDate = this.purchases[this.purchases.length-1].timestamp.slice(0,10);
	  var totalIncome = 0;
	  for(var i=0; i < this.purchases.length; i++){
		  //const day = this.purchases[i].timestamp.slice(0,10);
		  if(this.purchases[i].timestamp.slice(0,10) == lastDate){
			console.log(this.purchases[i].timestamp.slice(0,10));
			totalIncome += this.purchases[i].totalPrice;
		  }
		  
	  };
	  window.confirm("Las karu-ganancias del día de hoy son: " +totalIncome as any as string+" karu-pesos");
  }
  

  constructor(private purchaseService: PurchaseService) { }

  ngOnInit() {
	  this.getPurchases();
  }

}
