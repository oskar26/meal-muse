import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ChefHat, LogOut } from 'lucide-react';
import { useAuthStore } from '../lib/store';

export function Layout() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">Recipe Planner</span>
              </Link>
            </div>
            {isAuthenticated && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/preferences"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Preferences
                </Link>
                <Link
                  to="/meal-plan"
                  className="text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Meal Plan
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}