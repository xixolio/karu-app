export class Ingredient {
  id?: number;
  price: number;
  name: string;
  scale: number;
  //paymentTypeId?: number;
}

export class IngredientShow {
	backendPrice: number;
	middlePrice: number;
	name: string;
}

export interface IngredientVisual {
   name: string;
   backendPrice: number;
   middlePrice: number;
}