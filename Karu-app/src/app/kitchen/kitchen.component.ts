import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Item, KitchenItem } from '../item';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/internal/operators';
import { Message } from '../message';
//import {AnonymousSubscription} from "rxjs/Subscription";

import { timer } from 'rxjs';
// timer$ = timer(2000,1000);

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css'],
})
export class KitchenComponent implements OnInit {

  kitchenItems: KitchenItem[];
  messages: Message[];
  dates: string[];
  
  
  statusOptions: string[] = ['actualizado','pedido','visto','terminado'];
  getKitchenItems(): void {
	
	this.itemService.getKitchenItems()
      .subscribe(kitchenItems => {
		  this.kitchenItems = kitchenItems;
		  });
  }
  
  getMessages(): void {
	
	this.itemService.getMessages()
      .subscribe(messages => {
		  this.messages = messages.reverse().slice(0, 10);
		  });
  }
  
  sendMessage(message: string, name: string): void {
	  if(!name || !message ){ return; }
	  
	  let currentMessage: Message = { name : name, message: message };
	  this.itemService.sendMessage(currentMessage)
	  .subscribe();
  }
  
  
  
  private refreshData(): void {
    this.itemService.getKitchenItems()
      .subscribe(kitchenItems => {
		  this.kitchenItems = kitchenItems;
		  this.itemService.getMessages()
		  .subscribe(messages => {
			this.messages = messages.reverse().slice(0, 10);
			//let datesSet = new Set();
			//let tempMessages = Message[];
			//for(int i=0;i<10;i++){
			//	if(datesSet.has(this.messages[i].split(" ")[0])){
			//		tempMessages.add(this.messages[i]);
			//	}
			//	else{
					
			//	}
			//}
			
			console.log(this.messages);
			this.subscribeToData();
			});
		  });
	
	}

  private subscribeToData(): void {
		let fakeObservable = of('dummy').pipe(delay(5000)).subscribe (() => this.refreshData());
		
	}
  updateStatus(item: KitchenItem, status: string): void{
	  item.status = status;
	  this.itemService.updateKitchenItem(item)
	  .subscribe();
  }
  
  deleteKitchenItem(item: KitchenItem): void{
	  if(item.status != "terminado"){return;}
	  this.itemService.deleteKitchenItem(item)
	  .subscribe( ()=> this.kitchenItems = this.kitchenItems.filter(i => i != item));
		
  }


  constructor(private itemService: ItemService) {
		
	  }

  ngOnInit() {
	  this.getKitchenItems();
	  this.getMessages();
	  this.refreshData();
    //this.orderService.currentMessage.subscribe(message => this.message = message)
  }
}
