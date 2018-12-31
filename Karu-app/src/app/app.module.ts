import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { AppRoutingModule } from './/app-routing.module';
import { ItemsComponent } from './items/items.component';
import { OrdersComponent } from './orders/orders.component';
import { OngoingOrderComponent } from './ongoing-order/ongoing-order.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    IngredientsComponent,
    ItemsComponent,
    OrdersComponent,
    OngoingOrderComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
	FormsModule,
	HttpClientModule,
	AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
