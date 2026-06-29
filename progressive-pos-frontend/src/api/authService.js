import apiClient from './apiClient';

const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  getUserProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  subscribe: async (planData) => {
    const response = await apiClient.put('/auth/subscribe', planData);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const response = await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('pos_user');
  },
};

export default authService;
