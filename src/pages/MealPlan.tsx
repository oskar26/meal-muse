import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { MealCard } from '../components/MealCard';
import { EmptyState } from '../components/EmptyState';
import { DateRangePicker } from '../components/DateRangePicker';
import { createAIProvider } from '../lib/ai/factory';
import type { DayPlan, Meal, Recipe } from '../lib/types';

export function MealPlan() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000));

  useEffect(() => {
    if (!user?.apiKey || !user?.preferences) {
      navigate('/preferences');
    }
  }, [user, navigate]);

  if (!user?.apiKey || !user?.preferences) {
    return null;
  }

  const handleGenerateMealPlan = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const aiProvider = createAIProvider(user.preferences);
      const result = await aiProvider.generateMealPlan({
        ...user.preferences,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });
      setWeekPlan(result.weekPlan);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error generating meal plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecipe = async (meal: Meal): Promise<Recipe> => {
    const aiProvider = createAIProvider(user.preferences);
    const response = await aiProvider.getRecipeDetails(meal);
    return response.recipe;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Weekly Meal Plan</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <button
            onClick={handleGenerateMealPlan}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Utensils className="h-5 w-5" />
            <span>{loading ? 'Generating...' : 'Generate Plan'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {weekPlan.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {weekPlan.map((day, index) => (
            <MealCard
              key={`${day.date}-${index}`}
              {...day}
              onGetRecipe={handleGetRecipe}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}