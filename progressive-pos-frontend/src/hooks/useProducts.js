import { useState } from "react";
import { products as initialProducts } from "../data";
import { notify } from "../utils/notifications";

export const useProducts = () => {
  const [products, setProducts] = useState(initialProducts);

  const getProductById = (id) => {
    return products.find((product) => product.id === id);
  };

  const getLowStockProducts = () => {
    return products.filter((product) => product.stock < 10);
  };

  const addProduct = (productData) => {
    try {
      const newProduct = {
        ...productData,
        // Best approach for purely client-side dynamic ID generation without external libs
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        status: productData.stock >= 10 ? "IN STOCK" : productData.stock > 0 ? "LOW STOCK" : "OUT OF STOCK"
      };

      setProducts(prevProducts => [newProduct, ...prevProducts]);
      return true;
    } catch (error) {
      console.error("Failed to add product:", error);
      notify.error("Failed to add product");
      return false;
    }
  };

  const updateProduct = (id, updatedData) => {
    try {
      setProducts(prevProducts => prevProducts.map(product => {
        if (product.id === id) {
          return {
            ...product,
            ...updatedData,
            status: updatedData.stock >= 10 ? "IN STOCK" : updatedData.stock > 0 ? "LOW STOCK" : "OUT OF STOCK"
          };
        }
        return product;
      }));
      return true;
    } catch (error) {
      console.error("Failed to update product:", error);
      notify.error("Failed to update product");
      return false;
    }
  };

  const deleteProduct = (id) => {
    try {
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to delete product:", error);
      notify.error("Failed to delete product");
      return false;
    }
  };

  return {
    products,
    getProductById,
    getLowStockProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
