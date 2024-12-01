import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField } from './FormField';
import { SelectField } from './SelectField';
import { MultiSelectField } from './MultiSelectField';

const schema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  aiProvider: z.enum(['openai', 'claude', 'gemini'], {
    required_error: 'Please select an AI provider',
  }),
  calories: z.number().min(500).max(5000).optional(),
  mealsPerDay: z.number().min(1).max(6).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  cuisinePreferences: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  cookingTime: z.number().min(10).max(180).optional(),
  skillLevel: z.string({
    required_error: 'Please select your cooking skill level',
  }),
  mealTypes: z.array(z.string()).min(1, 'Please select at least one meal type'),
  proteinPreference: z.string().optional(),
});

export type PreferenceFormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: PreferenceFormData) => void;
  initialData?: Partial<PreferenceFormData>;
}

const aiProviders = [
  { value: 'openai', label: 'OpenAI GPT-4' },
  { value: 'claude', label: 'Anthropic Claude' },
  { value: 'gemini', label: 'Google Gemini' },
];

const dietaryRestrictions = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Gluten-free',
  'Dairy-free',
  'Keto',
  'Paleo',
];

const cuisines = [
  'Italian',
  'Japanese',
  'Mexican',
  'Indian',
  'Chinese',
  'Mediterranean',
  'Thai',
  'French',
  'American',
];

const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const mealTypes = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert',
];

const proteinPreferences = [
  { value: 'any', label: 'Any' },
  { value: 'high', label: 'High Protein' },
  { value: 'low', label: 'Low Protein' },
  { value: 'plant-based', label: 'Plant-based Protein' },
];

export function PreferenceForm({ onSubmit, initialData }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<PreferenceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      calories: 2000,
      mealsPerDay: 3,
      cookingTime: 30,
      skillLevel: 'intermediate',
      proteinPreference: 'any',
      ...initialData,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Fields marked with * are required
              </p>
            </div>
          </div>
        </div>

        <SelectField
          label="AI Provider *"
          options={aiProviders}
          error={errors.aiProvider}
          {...register('aiProvider')}
        />

        <FormField
          label="API Key *"
          type="password"
          error={errors.apiKey}
          {...register('apiKey')}
        />

        <SelectField
          label="Cooking Skill Level *"
          options={skillLevels}
          error={errors.skillLevel}
          {...register('skillLevel')}
        />

        <MultiSelectField
          name="mealTypes"
          label="Meal Types *"
          options={mealTypes}
          control={control}
          error={errors.mealTypes}
        />

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900">Optional Preferences</h3>
          <p className="mt-1 text-sm text-gray-500">
            Customize your meal plan further with these optional settings
          </p>
        </div>

        <FormField
          label="Daily Calories"
          type="number"
          error={errors.calories}
          {...register('calories', { valueAsNumber: true })}
        />

        <FormField
          label="Meals per Day"
          type="number"
          error={errors.mealsPerDay}
          {...register('mealsPerDay', { valueAsNumber: true })}
        />

        <MultiSelectField
          name="dietaryRestrictions"
          label="Dietary Restrictions"
          options={dietaryRestrictions}
          control={control}
          error={errors.dietaryRestrictions}
        />

        <MultiSelectField
          name="cuisinePreferences"
          label="Cuisine Preferences"
          options={cuisines}
          control={control}
          error={errors.cuisinePreferences}
        />

        <MultiSelectField
          name="allergies"
          label="Allergies"
          options={[]}
          isCreatable
          control={control}
          error={errors.allergies}
        />

        <FormField
          label="Maximum Cooking Time (minutes)"
          type="number"
          error={errors.cookingTime}
          {...register('cookingTime', { valueAsNumber: true })}
        />

        <SelectField
          label="Protein Preference"
          options={proteinPreferences}
          error={errors.proteinPreference}
          {...register('proteinPreference')}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  );
}