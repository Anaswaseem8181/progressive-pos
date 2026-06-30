import apiClient from './apiClient';

const orderService = {
  createOrder: async (payload) => {
    const response = await apiClient.post('/orders', payload);
    return response.data;
  },

  getOrders: async (limit = 20, customerId = null) => {
    const params = { limit };
    if (customerId) params.customerId = customerId;
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  getOrderStats: async () => {
    const response = await apiClient.get('/orders/stats');
    return response.data;
  },

  /** Date-filtered stats: revenue, totalOrders, totalDiscount */
  getReportStats: async (startDate, endDate) => {
    const response = await apiClient.get('/orders/report-stats', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /** Top selling products aggregated from real orders */
  getTopSelling: async (startDate, endDate, limit = 10) => {
    const response = await apiClient.get('/orders/top-selling', {
      params: { startDate, endDate, limit },
    });
    return response.data;
  },

  /** Date-filtered sales history */
  getOrderHistory: async (startDate, endDate, limit = 50) => {
    const response = await apiClient.get('/orders/history', {
      params: { startDate, endDate, limit },
    });
    return response.data;
  },
};

export default orderService;

