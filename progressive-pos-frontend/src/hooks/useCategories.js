import { useState, useCallback } from "react";
import { categoryService } from "../api/categoryService";
import { notify } from "../utils/notifications";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      notify.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  return { categories, loading, fetchCategories };
};
