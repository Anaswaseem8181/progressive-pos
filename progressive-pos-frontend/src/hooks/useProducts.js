import { useState, useCallback } from "react";
import { productService } from "../api/productService";
import { notify } from "../utils/notifications";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [loadingActive, setLoadingActive] = useState(false);
  const [loadingArchived, setLoadingArchived] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoadingActive(true);
    try {
      const data = await productService.getProducts(false);
      if (data.success) setProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      notify.error("Failed to load products");
    } finally {
      setLoadingActive(false);
    }
  }, []);

  const fetchArchivedProducts = useCallback(async () => {
    setLoadingArchived(true);
    try {
      const data = await productService.getProducts(true);
      if (data.success) setArchivedProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch archived products:", error);
      notify.error("Failed to load archived products");
    } finally {
      setLoadingArchived(false);
    }
  }, []);

  const getProductById = (id) => products.find((p) => p._id === id);

  // Low stock = any product where any variant has stock < 5
  const getLowStockProducts = () =>
    products.filter((p) =>
      p.variants?.some((v) => v.stock > 0 && v.stock < 5)
    );

  const addProduct = async (productData) => {
    try {
      const data = await productService.addProduct(productData);
      if (data.success) {
        setProducts((prev) => [data.data, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to add product");
      return false;
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const data = await productService.updateProduct(id, updatedData);
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? data.data : p))
        );
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to update product");
      return false;
    }
  };

  // Atomic variant stock adjustment — quantity can be positive or negative
  const updateVariantStock = async (productId, variantId, quantity) => {
    try {
      const data = await productService.updateVariantStock(productId, variantId, quantity);
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? data.data : p))
        );
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to update stock");
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const data = await productService.deleteProduct(id);
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        fetchArchivedProducts();
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to archive product");
      return false;
    }
  };

  const restoreProduct = async (id) => {
    try {
      const data = await productService.restoreProduct(id);
      if (data.success) {
        setArchivedProducts((prev) => prev.filter((p) => p._id !== id));
        setProducts((prev) => [data.data, ...prev]);
        return true;
      }
      return false;
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to restore product");
      return false;
    }
  };

  return {
    products,
    archivedProducts,
    loadingActive,
    loadingArchived,
    fetchProducts,
    fetchArchivedProducts,
    getProductById,
    getLowStockProducts,
    addProduct,
    updateProduct,
    updateVariantStock,
    deleteProduct,
    restoreProduct,
  };
};
