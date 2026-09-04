/**
 * Authentication Service Module
 * Handles future integration with the .NET Backend API endpoint.
 * API Endpoint target: POST /api/auth/login
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const authService = {
  /**
   * Sends login credentials to backend API.
   * @param {Object} credentials - { identifier, password }
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async login(credentials) {
    // Note: Future backend connection point for .NET API POST /api/auth/login
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrUsername: credentials.identifier,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Authentication failed. Please check your credentials.');
    }

    return response.json();
  },
};
