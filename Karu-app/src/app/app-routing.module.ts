import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { OrdersComponent } from './orders/orders.component';
import { OngoingOrderComponent } from './ongoing-order/ongoing-order.component';
import { SpecialIngredientsComponent } from './special-ingredients/special-ingredients.component';
import { KitchenComponent } from './kitchen/kitchen.component';
import { PlanBComponent } from './plan-b/plan-b.component';
const routes: Routes = [
  //	{ path: '', redirectTo: '/ingredients', pathMatch: 'full' },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'ongoingOrders', component: OngoingOrderComponent },
  { path: 'specialIngredients', component: SpecialIngredientsComponent },
  { path: 'kitchen', component: KitchenComponent },
  { path: 'planB', component: PlanBComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
