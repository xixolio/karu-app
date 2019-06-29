import { Item } from './item';

export class Order {
  id?: number;
  orderPrice?: number;
  items: Item[];
  name?: string;
}