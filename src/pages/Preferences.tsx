import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { PreferenceForm, PreferenceFormData } from '../components/PreferenceForm';

export function Preferences() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const handleSubmit = async (data: PreferenceFormData) => {
    updateUser({
      apiKey: data.apiKey,
      preferences: data,
    });
    navigate('/meal-plan');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Preferences</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <PreferenceForm
          onSubmit={handleSubmit}
          initialData={user?.preferences}
        />
      </div>
    </div>
  );
}