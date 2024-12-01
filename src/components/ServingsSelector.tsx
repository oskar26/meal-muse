import React from 'react';
import { Users } from 'lucide-react';

interface Props {
  servings: number;
  onChange: (servings: number) => void;
}

export function ServingsSelector({ servings, onChange }: Props) {
  return (
    <div className="flex items-center space-x-2">
      <Users className="h-5 w-5 text-gray-400" />
      <select
        value={servings}
        onChange={(e) => onChange(Number(e.target.value))}
        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num} {num === 1 ? 'person' : 'people'}
          </option>
        ))}
      </select>
    </div>
  );
}