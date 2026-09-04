import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle Component
 * Minimal, elegant Light/Dark mode toggle button with Sun/Moon icons.
 */
export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-[#2d5a44] ${
        isDark
          ? 'bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700 hover:text-white'
          : 'bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-100 hover:text-stone-900 shadow-xs'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-stone-600" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
};
