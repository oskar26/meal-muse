import type { UserPreferences, DayPlan, Meal, Recipe } from '../types';

export interface MealPlanResponse {
  weekPlan: DayPlan[];
}

export interface RecipeResponse {
  recipe: Recipe;
}

export interface AIProvider {
  generateMealPlan(preferences: UserPreferences & {
    startDate: string;
    endDate: string;
  }): Promise<MealPlanResponse>;
  getRecipeDetails(meal: Meal): Promise<RecipeResponse>;
}