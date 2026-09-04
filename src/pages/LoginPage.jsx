import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { TopographicVisual } from '../components/TopographicVisual';
import { LoginForm } from '../components/LoginForm';
import { ThemeToggle } from '../components/ui/ThemeToggle';

/**
 * LoginPage Component
 * Split-screen responsive layout supporting Light & Dark themes.
 */
export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#fcfbf9] dark:bg-[#121314] text-[#191919] dark:text-stone-100 flex flex-col lg:flex-row font-sans antialiased transition-colors duration-200 bg-topo-pattern-dark">
      {/* Top-Right Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* LEFT SIDE: Brand & Integrated Topographic Geospatial Visual */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200/70 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/30">
        {/* Brand Header */}
        <div className="space-y-2.5 max-w-md pr-12 lg:pr-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#2d5a44] dark:bg-[#2d5a44] flex items-center justify-center text-white">
              <Shield className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">
              GeoShield <span className="font-mono text-[11px] font-medium px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 ml-0.5">NER</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 leading-snug">
            AI-Powered Landslide Risk Prediction & Early Warning System
          </h1>

          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-normal leading-relaxed">
            Real-time geospatial analytics, terrain deformation monitoring, and predictive risk scoring for hazardous regions.
          </p>
        </div>

        {/* Abstract Topographic Visual - Naturally integrated into panel */}
        <div className="my-4 lg:my-2 w-full flex-1 flex items-center justify-center">
          <TopographicVisual />
        </div>
      </div>

      {/* RIGHT SIDE: Compact, Refined Login Form */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-12 flex items-center justify-center bg-[#fcfbf9] dark:bg-[#121314]">
        <div className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div className="space-y-1 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Sign in to continue to GeoShield NER.
            </p>
          </div>

          {/* Compact Form Card */}
          <div className="bg-white dark:bg-stone-900/80 p-5 sm:p-6 rounded-lg border border-stone-200/80 dark:border-stone-800 shadow-xs">
            <LoginForm onSubmitSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};
