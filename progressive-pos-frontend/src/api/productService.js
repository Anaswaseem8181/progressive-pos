import apiClient from './apiClient';

export const productService = {
  getProducts: async (isDeleted = false) => {
    const response = await apiClient.get(`/products?isDeleted=${isDeleted}`);
    return response.data;
  },

  addProduct: async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  restoreProduct: async (id) => {
    const response = await apiClient.post(`/products/${id}/restore`);
    return response.data;
  },

  // Atomic variant stock update (delta can be positive or negative)
  updateVariantStock: async (productId, variantId, quantity) => {
    const response = await apiClient.patch(`/products/${productId}/variant-stock`, {
      variantId,
      quantity,
    });
    return response.data;
  },
};
