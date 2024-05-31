/* Copyright(c) David Rueter All rights reserved. This program is made available under the
terms of the AGPLv3 license. See the LICENSE file in the project root for more information. */

import {Ingredient, RecipeOption, FoodForest, AllRecipeOptions, SurpriseRecipe, FreshByProduct, FreshByTypology, PreservedRecipe} from './recipe.interfaces';

export function filterOptions(options: RecipeOption[], type: string): RecipeOption[] {
  return options.filter(o=>o.type === type);
}

export function filterIngredientsByDate(ingredients: Ingredient[], date: Date): Ingredient[] {
  const weekNumber = getWeekNumber(date);
  return ingredients.filter(ingredient => {
    if (!ingredient.availableWeeks) return true;
    const range = ingredient.availableWeeks.split('-').map(Number);
    if (range.length == 0) return weekNumber === range[0];
    return weekNumber >= range[0] && weekNumber <= range[1];
  });
}

export function filterIngredientsByFoodForest(ingredients: Ingredient[], forests: FoodForest[]): Ingredient[]{
  // Convert the array of forests to a Set for faster access
  const forestSet = new Set(forests.filter(f=>f.enabled).map(forest => forest.id));

  // Filter ingredients based on whether their foodForest's id is in the forest set
  return ingredients.filter(ingredient => forestSet.has(ingredient.foodForest.id));
}

export function jsonForRecipe(options: AllRecipeOptions): any{
  switch (options.type){
    case 'surprise-me': 
        const sr: SurpriseRecipe = options as SurpriseRecipe;
        return { 
          type:sr.type,
          style: sr.culinaryStyle?.prompt,
          serving: sr.servingStyle?.prompt,
          directive: sr.directive?.prompt,
          ingredients: sr.ingredients.map(i=>i.name),
          mvp: sr.mvp?.prompt
         };
    case 'mvp': 
        const product: FreshByProduct = options as FreshByProduct;
        return { 
          type:product.type,
          style: product.culinaryStyle?.prompt,
          serving: product.servingStyle?.prompt,
          directive: product.directive?.prompt,
          ingredients: product.ingredients.map(i=>i.name),
          mvp: product.mvp?.prompt,
          accommodations: product.accommodations?.map(a=>a.prompt) || []
         };
    case 'typology': 
        const typology: FreshByTypology = options as FreshByTypology;
        return { 
          type:typology.type,
          style: typology.culinaryStyle?.prompt,
          serving: typology.servingStyle?.prompt,
          directive: typology.directive?.prompt,
          ingredients: typology.ingredients.map(i=>i.name),
          typology: typology.typology?.prompt,
          accommodations: typology.accommodations?.map(a=>a.prompt) || [],
          mvp: typology.mvp?.prompt || "no mvp"
         };
    case 'preserve':
        const preserve: PreservedRecipe = options as PreservedRecipe;
        return {
          flavor: preserve.flavor?.prompt,
          texture: preserve.texture?.prompt,
          skill: preserve.skill?.prompt,
          timeframe: preserve.timeframe?.prompt,
          preservationType: preserve.preservationType?.prompt,
          accommodations: preserve.accommodations?.map(a=>a.prompt) || [],
        }
    default:
      throw new Error("Invalid recipe type: " + options.type);
  }
}

function getWeekNumber(date: Date): number {
  // Copy date so don't modify original
  let d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number, make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  let weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  return weekNo;
}

function formatWeek(date: Date): string {
  const weekNumber = getWeekNumber(date);
  return `WEEK_${weekNumber}`;
}
