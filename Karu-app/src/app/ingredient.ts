export class Ingredient {
  id?: number;
  price: number;
  name: string;
  scale: number;
  label: string;
}

export class IngredientShow {
	backendPrice: number;
	middlePrice: number;
	name: string;
	label: string;
}

export interface IngredientVisual {
   name: string;
   backendPrice: number;
   middlePrice: number;
   label: string;
}