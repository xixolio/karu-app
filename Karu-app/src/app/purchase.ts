import { Order } from './order';

export class Purchase {
  id?: number;
  orders: Order[];
  totalPrice: number;
  timestamp?: string;
}