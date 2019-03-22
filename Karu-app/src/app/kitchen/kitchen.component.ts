import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css'],
})
export class KitchenComponent implements OnInit {

  message:string;

  constructor(private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.currentMessage.subscribe(message => this.message = message)
  }

  newMessage() {
    this.orderService.changeMessage("Hello from Sibling")
  }

}
