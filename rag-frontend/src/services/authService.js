import api from './api';

export const authService = {
  /**
   * Registers a new user account
   * @param {string} email
   * @param {string} password
   */
  async register(email, password) {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  /**
   * Authenticates user credentials and retrieves JWT access token
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Fetches profile information for the currently authenticated user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
