'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      <span
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        {theme === 'light' ? (
          <Sun className="w-3 h-3 text-yellow-500 m-0.5" />
        ) : (
          <Moon className="w-3 h-3 text-blue-600 m-0.5" />
        )}
      </span>
    </button>
  );
}
