import apiClient from './apiClient';

const staffService = {
  getStaff: async () => {
    const response = await apiClient.get('/staff');
    return response.data;
  },

  addStaff: async (staffData) => {
    const response = await apiClient.post('/staff', staffData);
    return response.data;
  },

  updateStaff: async (id, staffData) => {
    const response = await apiClient.put(`/staff/${id}`, staffData);
    return response.data;
  },

  deleteStaff: async (id) => {
    const response = await apiClient.delete(`/staff/${id}`);
    return response.data;
  },
};

export default staffService;
