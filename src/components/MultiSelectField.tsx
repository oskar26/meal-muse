import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';
import { X } from 'lucide-react';

interface Props {
  name: string;
  label: string;
  options: string[];
  control: Control<any>;
  error?: FieldError;
  isCreatable?: boolean;
}

export function MultiSelectField({ name, label, options, control, error, isCreatable }: Props) {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field: { value, onChange } }) => (
          <div>
            <div className="mt-1 flex flex-wrap gap-2">
              {value.map((item: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((i: string) => i !== item))}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full hover:bg-indigo-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            {isCreatable ? (
              <div className="mt-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue.trim()) {
                      e.preventDefault();
                      if (!value.includes(inputValue.trim())) {
                        onChange([...value, inputValue.trim()]);
                      }
                      setInputValue('');
                    }
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Type and press Enter to add"
                />
              </div>
            ) : (
              <select
                multiple
                value={[]}
                onChange={(e) => {
                  const option = e.target.value;
                  if (!value.includes(option)) {
                    onChange([...value, option]);
                  }
                }}
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {options
                  .filter((option) => !value.includes(option))
                  .map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            )}
          </div>
        )}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}