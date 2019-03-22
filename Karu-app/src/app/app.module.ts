import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { AppRoutingModule } from './/app-routing.module';
import { ItemsComponent } from './items/items.component';
import { OrdersComponent } from './orders/orders.component';
import { OngoingOrderComponent } from './ongoing-order/ongoing-order.component';
import { MessagesComponent } from './messages/messages.component';
import { SpecialIngredientsComponent } from './special-ingredients/special-ingredients.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { PlanBComponent } from './plan-b/plan-b.component';

@NgModule({
  declarations: [
    AppComponent,
    IngredientsComponent,
    ItemsComponent,
    OrdersComponent,
    OngoingOrderComponent,
    MessagesComponent,
    SpecialIngredientsComponent,
    KitchenComponent,
    PlanBComponent
  ],
  imports: [
    BrowserModule,
	FormsModule,
	HttpClientModule,
	AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
