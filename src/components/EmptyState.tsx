import React from 'react';
import { Utensils } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
      <Utensils className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No meal plan generated</h3>
      <p className="mt-1 text-sm text-gray-500">
        Click the generate button to create your personalized meal plan
      </p>
    </div>
  );
}