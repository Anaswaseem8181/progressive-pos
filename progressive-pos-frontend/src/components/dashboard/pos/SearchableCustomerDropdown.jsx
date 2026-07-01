import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, User, Phone } from "lucide-react";
import customerService from "../../../api/customerService";

export const SearchableCustomerDropdown = ({ selectedCustomerId, onSelectCustomer, refreshKey = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch customers when search term changes
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const response = await customerService.getCustomers(searchTerm);
        if (response.success) {
          setCustomers(response.data);

          // Auto-select walk-in if no customer is currently selected and we have results
          if (!selectedCustomerId && response.data.length > 0) {
            onSelectCustomer(response.data[0]._id || response.data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch customers for dropdown", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCustomerId, onSelectCustomer, refreshKey]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCustomer = customers.find(
    (c) => (c._id || c.id) === selectedCustomerId
  );

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <div
        className="flex items-center w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm bg-white cursor-pointer hover:border-emerald-500 transition-colors"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearchTerm(""); // Clear search when opening
        }}
      >
        <span className="truncate flex-1 font-medium text-gray-700">
          {selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.phone})` : "Select Customer..."}
        </span>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-gray-400">Searching...</div>
            ) : customers.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400">No customers found</div>
            ) : (
              customers.map((customer) => {
                const id = customer._id || customer.id;
                const isSelected = id === selectedCustomerId;
                return (
                  <div
                    key={id}
                    onClick={() => {
                      onSelectCustomer(id);
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2.5 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${isSelected ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-emerald-100' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {customer.isWalkIn ? <User size={14} /> : customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">
                        {customer.name}
                        {customer.isWalkIn && <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">DEFAULT</span>}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Phone size={10} />
                        {customer.phone}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
