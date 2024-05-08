
export interface FoodForest {
	id: string;
	name: string;
	enabled: boolean;
}


export interface RecipeOption {
	id: string;
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
	id: string;
	name: string;
	enabled: boolean; // rename to selected
	availableWeeks: string;
	description: string;
	foodForest: FoodForest;
}


export interface IngredientList {
	ingredients: Ingredient[]; // fixme use Ingredient
}

export interface MVP {
	productName: string;
	companyName: string;
	linkToInfo: string;
	mvpCategory: string;
	abbreviation: string;
}

export interface BasicRecipe extends IngredientList {
	type: string;
	accommodations?: RecipeOption[];
	date?: Date;
}

export interface FreshRecipe extends BasicRecipe {
	directive?: RecipeOption;
	culinaryStyle?: RecipeOption;
	servingStyle?: RecipeOption;
	serving?: RecipeOption;
}

export interface SurpriseRecipe extends BasicRecipe {
	mvp?: RecipeOption;
	culinaryStyle?: RecipeOption;
	servingStyle?: RecipeOption;
	directive?: RecipeOption;
}

export interface PreservedRecipe extends BasicRecipe {
	taste?: RecipeOption;
	texture?: RecipeOption;
	level?: RecipeOption;
	fermentTime?: RecipeOption;
}

export interface FreshByTypology extends FreshRecipe {
	typology?: RecipeOption;

}

export interface FreshByProduct extends FreshRecipe {
	mvp?: RecipeOption;
}

export interface AllRecipeOptions extends FreshByProduct, FreshByTypology, PreservedRecipe, SurpriseRecipe {

}

