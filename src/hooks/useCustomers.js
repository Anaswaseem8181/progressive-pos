import { useState, useEffect, useCallback } from "react";
import customerService from "../api/customerService";
import { notify } from "../utils/notifications";

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async (searchTerm = '') => {
    setIsLoading(true);
    try {
      const response = await customerService.getCustomers(searchTerm);
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch customers");
      notify.error("Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const getCustomerById = (id) => {
    return customers.find((customer) => customer._id === id || customer.id === id);
  };

  const addCustomer = async (customerData) => {
    try {
      const response = await customerService.addCustomer(customerData);
      if (response.success) {
        setCustomers((prevCustomers) => [response.data, ...prevCustomers]);
        return response.data;
      }
      return null;
    } catch (error) {
      notify.error(error.response?.data?.message || "Failed to add customer");
      return null;
    }
  };

  const updateCustomer = async (id, updatedData) => {
    try {
      const response = await customerService.updateCustomer(id, updatedData);
      if (response.success) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            (customer._id === id || customer.id === id) ? { ...customer, ...response.data } : customer
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update customer:", error);
      notify.error(error.response?.data?.message || "Failed to update customer");
      return false;
    }
  };

  return {
    customers,
    isLoading,
    error,
    getCustomerById,
    addCustomer,
    updateCustomer,
    refreshCustomers: fetchCustomers,
  };
};
