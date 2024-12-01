import { GoogleGenerativeAI } from '@google/generative-ai';
import type { UserPreferences, DayPlan } from './types';

interface MealPlanResponse {
  weekPlan: DayPlan[];
}

export async function generateMealPlan(apiKey: string, preferences: UserPreferences): Promise<MealPlanResponse> {
  if (!apiKey?.trim()) {
    throw new Error('Please provide a valid API key in your preferences');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You're a professional nutritionist with over 15 years of experience in creating personalized meal plans that cater to individual preferences and dietary needs. Your expertise lies in crafting varied and balanced meals that not only meet nutritional guidelines but also excite the palate of your clients.

Your task is to create a weekly meal plan for me. Here are the details:

- Daily calorie target: ${preferences.calories} calories
- Meals per day: ${preferences.mealsPerDay}
- Dietary restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'}
- Cuisine preferences: ${preferences.cuisinePreferences.join(', ') || 'Any'}
- Allergies: ${preferences.allergies.join(', ') || 'None'}
- Maximum cooking time per meal: ${preferences.cookingTime} minutes
- Cooking skill level: ${preferences.skillLevel}
- Preferred meal types: ${preferences.mealTypes.join(', ') || 'Any'}
- Protein preference: ${preferences.proteinPreference}

For each meal, provide:
1. Name
2. Brief description
3. Nutritional information (calories, protein, carbs, fat)

IMPORTANT: You must respond with valid JSON only, following this exact structure:
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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const data = JSON.parse(text);
      
      if (!data?.weekPlan?.length) {
        throw new Error('Invalid meal plan format received');
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
    } catch (parseError) {
      console.error('Failed to parse API response:', parseError);
      throw new Error('The meal plan could not be generated. Please try again.');
    }
  } catch (error) {
    console.error('Error generating meal plan:', error);
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('Invalid API key. Please check your API key in preferences.');
    }
    throw new Error('Failed to generate meal plan. Please try again in a few moments.');
  }
}