import { Item } from './item';

export class Order {
  id: number;
  orderPrice?: number;
  items: Item[];
  rfID: number;
  ongoing: boolean;
  receiving: number;
}