import { z } from 'zod';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  recipe?: Recipe;
}

export interface DayPlan {
  date: string;
  meals: Meal[];
}

export interface UserPreferences {
  calories: number;
  dietaryRestrictions: string[];
  mealsPerDay: number;
  cuisinePreferences: string[];
  allergies: string[];
  cookingTime: number;
  skillLevel: string;
  mealTypes: string[];
  proteinPreference: string;
  aiProvider: 'openai' | 'claude' | 'gemini';
  apiKey: string;
}

export const recipeSchema = z.object({
  ingredients: z.array(z.object({
    name: z.string(),
    amount: z.number(),
    unit: z.string()
  })),
  instructions: z.array(z.string()),
  prepTime: z.number(),
  cookTime: z.number(),
  servings: z.number()
});

export type Recipe = z.infer<typeof recipeSchema>;