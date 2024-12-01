import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import type { DayPlan, Meal, Recipe } from '../lib/types';
import { RecipeModal } from './RecipeModal';

interface Props {
  date: string;
  meals: Meal[];
  onGetRecipe: (meal: Meal) => Promise<Recipe>;
}

export function MealCard({ date, meals, onGetRecipe }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMealClick = async (meal: Meal) => {
    setSelectedMeal(meal);
    setLoading(true);
    try {
      const recipe = await onGetRecipe(meal);
      setRecipe(recipe);
    } catch (error) {
      console.error('Failed to load recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServingsChange = (servings: number) => {
    if (recipe) {
      setRecipe({ ...recipe, servings });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-500"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className={`space-y-4 ${expanded ? '' : 'hidden'}`}>
        {meals.map((meal, index) => (
          <div
            key={index}
            className="border-t pt-4 first:border-t-0 first:pt-0"
          >
            <button
              onClick={() => handleMealClick(meal)}
              className="w-full text-left hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">{meal.name}</h4>
                <span className="text-sm text-gray-500 capitalize">{meal.type}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{meal.description}</p>
              <div className="mt-2 grid grid-cols-4 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{meal.calories}</div>
                  <div className="text-gray-600">kcal</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{meal.protein}g</div>
                  <div className="text-gray-600">Protein</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{meal.carbs}g</div>
                  <div className="text-gray-600">Carbs</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-900">{meal.fat}g</div>
                  <div className="text-gray-600">Fat</div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {recipe && selectedMeal && (
        <RecipeModal
          recipe={recipe}
          onClose={() => {
            setRecipe(null);
            setSelectedMeal(null);
          }}
          onServingsChange={handleServingsChange}
        />
      )}
    </div>
  );
}