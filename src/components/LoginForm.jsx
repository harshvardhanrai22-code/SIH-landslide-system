import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

/**
 * LoginForm Component
 * Handles local form state, validation, show/hide password toggle, loading state, and dark mode compatibility.
 */
export const LoginForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    identifier: '',
    password: '',
    general: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { identifier: '', password: '', general: '' };

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Email or Username is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: '' }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (onSubmitSuccess) {
        onSubmitSuccess(formData);
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.message || 'An error occurred during sign in.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4 sm:space-y-5" noValidate>
      {errors.general && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-md">
          {errors.general}
        </div>
      )}

      {/* Email / Username field */}
      <Input
        id="identifier"
        name="identifier"
        label="Email or Username"
        type="text"
        placeholder="name@organization.com or username"
        value={formData.identifier}
        onChange={handleChange}
        error={errors.identifier}
        autoComplete="username"
        required
      />

      {/* Password field with Show/Hide toggle */}
      <div className="space-y-1">
        <Input
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
        />

        <div className="flex justify-end pt-1">
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              alert('Password reset feature will be connected with the .NET backend auth service.');
            }}
            className="text-xs text-stone-500 dark:text-stone-400 hover:text-[#2d5a44] dark:hover:text-emerald-400 transition-colors underline-offset-2 hover:underline"
          >
            Forgot password?
          </a>
        </div>
      </div>

      {/* Primary Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        fullWidth
        isLoading={isLoading}
        className="mt-2 py-2.5 sm:py-3"
      >
        Sign In
      </Button>

      {/* Register Callout */}
      <div className="text-center pt-1">
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => alert('Account registration flow will be available soon.')}
            className="text-[#2d5a44] dark:text-emerald-400 font-semibold hover:underline focus:outline-none"
          >
            Register
          </button>
        </p>
      </div>
    </form>
  );
};
