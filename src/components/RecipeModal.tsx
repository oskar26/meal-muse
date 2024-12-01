import React from 'react';
import { X, Clock } from 'lucide-react';
import type { Recipe } from '../lib/types';
import { ServingsSelector } from './ServingsSelector';

interface Props {
  recipe: Recipe;
  onClose: () => void;
  onServingsChange: (servings: number) => void;
}

export function RecipeModal({ recipe, onClose, onServingsChange }: Props) {
  const [servings, setServings] = React.useState(recipe.servings);

  const handleServingsChange = (newServings: number) => {
    setServings(newServings);
    onServingsChange(newServings);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <ServingsSelector servings={servings} onChange={handleServingsChange} />
                <div className="flex items-center text-gray-500">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{recipe.prepTime + recipe.cookTime} mins</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
              <ul className="mt-2 space-y-2">
                {recipe.ingredients.map((ingredient, index) => {
                  const scaledAmount = (ingredient.amount * servings) / recipe.servings;
                  return (
                    <li key={index} className="text-gray-600">
                      {scaledAmount.toFixed(1)} {ingredient.unit} {ingredient.name}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Instructions</h3>
              <ol className="mt-2 space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="text-gray-600">
                    <span className="font-medium text-gray-900">{index + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}