import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

/**
 * DashboardPlaceholder Component
 * Minimal placeholder route for /dashboard until dashboard components are built.
 */
export const DashboardPlaceholder = () => {
  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#191919] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-lg bg-[#2d5a44] flex items-center justify-center text-white mb-4">
        <Shield className="w-6 h-6 stroke-[2]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-semibold text-stone-900 mb-2">
        Dashboard coming soon.
      </h1>

      <p className="text-sm text-stone-500 max-w-sm mb-6">
        GeoShield NER application portal authenticated successfully. Dashboard interface modules will be integrated next.
      </p>

      <Link
        to="/login"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Login
      </Link>
    </div>
  );
};
