import apiClient from './apiClient';

const customerService = {
  getCustomers: async (search = '') => {
    const response = await apiClient.get(`/customers?search=${encodeURIComponent(search)}`);
    return response.data;
  },

  addCustomer: async (customerData) => {
    const response = await apiClient.post('/customers', customerData);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await apiClient.put(`/customers/${id}`, customerData);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  }
};

export default customerService;
