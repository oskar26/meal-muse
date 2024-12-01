import type { UserPreferences, DayPlan } from '../types';

export function createPrompt(preferences: UserPreferences): string {
  const prompt = `You are a professional nutritionist creating a personalized weekly meal plan. Generate a meal plan in JSON format with the following requirements:

Daily calorie target: ${preferences.calories || 'flexible'} calories
Meals per day: ${preferences.mealsPerDay || 3}
Dietary restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}
Cuisine preferences: ${preferences.cuisinePreferences?.join(', ') || 'Any'}
Allergies: ${preferences.allergies?.join(', ') || 'None'}
Maximum cooking time: ${preferences.cookingTime || 'flexible'} minutes
Cooking skill level: ${preferences.skillLevel}
Meal types: ${preferences.mealTypes.join(', ')}
Protein preference: ${preferences.proteinPreference || 'Any'}

Respond ONLY with a JSON object in this exact format:
{
  "weekPlan": [
    {
      "date": "YYYY-MM-DD",
      "meals": [
        {
          "name": "string",
          "description": "string",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number
        }
      ]
    }
  ]
}`;

  return prompt;
}

export function validateResponse(text: string): { weekPlan: DayPlan[] } {
  try {
    // Remove any markdown code block syntax if present
    const cleanText = text.replace(/```json\s*|\s*```/g, '');
    const data = JSON.parse(cleanText);
    
    if (!Array.isArray(data?.weekPlan)) {
      throw new Error('Invalid response format: weekPlan must be an array');
    }

    // Validate the structure of each day and meal
    data.weekPlan.forEach((day: DayPlan, index: number) => {
      if (!day.date || !Array.isArray(day.meals)) {
        throw new Error(`Invalid day format at index ${index}`);
      }

      day.meals.forEach((meal, mealIndex) => {
        if (!meal.name || !meal.description || 
            typeof meal.calories !== 'number' ||
            typeof meal.protein !== 'number' ||
            typeof meal.carbs !== 'number' ||
            typeof meal.fat !== 'number') {
          throw new Error(`Invalid meal format at day ${index}, meal ${mealIndex}`);
        }
      });
    });

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to parse response';
    throw new Error(`Invalid response format: ${message}`);
  }
}