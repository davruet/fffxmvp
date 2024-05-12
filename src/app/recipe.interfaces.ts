
export interface FoodForest {
	id: number;
	name: string;
	enabled: boolean;
  }
  

  export interface RecipeOption {
	id: number;
	type: string;
	name: string;
	prompt: string;
	abbreviation: string;
	enabled: boolean;
  }
  
 export interface PromptTemplate {
	type: string;
	prompt: string;
  }
  
export interface Ingredient {
	id: number;
	name: string;
	enabled: boolean; // rename to selected
	available: boolean;
	description: string;
  }
  

export interface IngredientList {
	ingredients: String[];
  }
  
export interface MVP {
	productName: string;
	companyName: string;
	linkToInfo: string;
	mvpCategory: string;
	abbreviation: string;
}
  
export interface BasicRecipe {
	type: string;
	directive?: any;
}
  
  // For the Surprise-me category
  export interface SurpriseRecipe extends BasicRecipe, IngredientList {
	mvp: string;
	style: string;
	serving: string;
  }
  
  // For the Preserved category
  export   interface PreservedRecipe extends BasicRecipe, IngredientList {
	dietaryRestrictions?: any;
	taste: string;
	texture: string;
	level: string;
	fermentTime: string;
  }
  
  // Assuming similar structures for fresh-by-typology and fresh-by-product
  export interface FreshByTypology extends BasicRecipe, IngredientList {
	typology: string;  // Example field, assuming typology categorization
  }
  
  export interface FreshByProduct extends BasicRecipe, IngredientList {
	productType: string;  // Example field, assuming specific product categorization
  }

