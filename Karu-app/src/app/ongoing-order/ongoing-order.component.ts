import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { PurchaseService } from '../purchase.service';
import { Order } from '../order';
import { Purchase } from '../purchase';


@Component({
  selector: 'app-ongoing-order',
  templateUrl: './ongoing-order.component.html',
  styleUrls: ['./ongoing-order.component.css']
})

export class OngoingOrderComponent implements OnInit {

  //ongoingOrders: Order[] = [];
  purchases: Purchase[];
  purchasePrice: number = 0;

  // Falta agregar mensajes
  // 1) Si el get obtuvo un objeto, avisar
  // 2) Si el get no obtuvo nada, avisar también
  
  getPurchases(): void {
	  this.purchaseService.getPurchases()
      .subscribe(purchases => this.purchases = purchases);
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
  

  constructor(private purchaseService: PurchaseService) { }

  ngOnInit() {
	  this.getPurchases();
  }

}
