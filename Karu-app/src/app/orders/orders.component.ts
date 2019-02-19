import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from '../order';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  orders: Order[];
  
  getOrders(): void {
	this.orderService.getOrders('B')
      .subscribe(orders => this.orders = orders);
  }

  constructor(private orderService: OrderService) { }

  ngOnInit() {
	  this.getOrders();
  }


}
