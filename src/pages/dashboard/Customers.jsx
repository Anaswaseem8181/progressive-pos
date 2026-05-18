import { useState, useEffect } from "react";
import { Plus, Search, Phone, Edit2, BarChart2 } from "lucide-react";
import { motion } from "motion/react";
import { useCustomers } from "../../hooks/useCustomers";
import { CustomerModal } from "../../components/modals/customers/CustomerModal";
import { CustomerHistoryModal } from "../../components/modals/customers/CustomerHistoryModal";
import { ActionDropdown } from "../../components/ui/ActionDropdown";
import { notify } from "../../utils/notifications";

const Customers = () => {
  const { customers, addCustomer, updateCustomer, refreshCustomers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [customerForHistory, setCustomerForHistory] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      refreshCustomers(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, refreshCustomers]);

  const handleSaveCustomer = async (data) => {
    if (customerToEdit) {
      if (await updateCustomer(customerToEdit._id || customerToEdit.id, data)) {
        notify.success("Customer updated successfully");
        closeCustomerModal();
      }
    } else {
      const newCustomer = await addCustomer(data);
      if (newCustomer) {
        notify.success("Customer added successfully");
        closeCustomerModal();
      }
    }
  };

  const closeCustomerModal = () => {
    setIsAddModalOpen(false);
    setCustomerToEdit(null);
  };

  const handleEditClick = (customer) => {
    setCustomerToEdit(customer);
    setIsAddModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleHistoryClick = (customer) => {
    setCustomerForHistory(customer);
    setIsHistoryModalOpen(true);
    setOpenDropdownId(null);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Customer Management
          </h1>
          <p className="text-gray-500 text-sm">
            Track your regular customers and their details.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]"
        >
          <Plus size={18} />
          New Customer
        </button>
      </div>

      <div className="relative">
        <Search
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers by name or phone..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50 overflow-y-auto max-h-[60vh]">
          {customers.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No customers found.
            </div>
          ) : (
            customers.map((customer) => (
              <div
                key={customer._id || customer.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{customer.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-0.5">
                      <Phone size={12} />
                      {customer.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-600">
                    {customer.status}
                  </span>

                  <ActionDropdown
                    isOpen={openDropdownId === (customer._id || customer.id)}
                    onToggle={() => setOpenDropdownId(openDropdownId === (customer._id || customer.id) ? null : (customer._id || customer.id))}
                    containerClassName="relative"
                    actions={[
                      {
                        label: "Purchase History",
                        icon: BarChart2,
                        onClick: () => handleHistoryClick(customer),
                        variant: "info",
                      },
                      {
                        label: "Edit Customer",
                        icon: Edit2,
                        onClick: () => handleEditClick(customer),
                        variant: "default",
                      },
                    ]}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CustomerModal
        isOpen={isAddModalOpen}
        onClose={closeCustomerModal}
        onSave={handleSaveCustomer}
        customer={customerToEdit}
      />

      <CustomerHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        customer={customerForHistory}
      />
    </motion.div>
  );
};

export default Customers;
