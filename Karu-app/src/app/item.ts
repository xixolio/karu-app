export class Item {
  id?: number;
  itemPrice: number;
  amount: number;
  ingredient: string;
  order?: string;
}

export class KitchenItem {
  id: number;
  item: Item;
  amount: number;
  status: string;
}