import { useState, useCallback, useEffect } from "react";
import { Filter, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useCurrency } from "../../hooks/useCurrency";
import orderService from "../../api/orderService";
import { notify } from "../../utils/notifications";

// Default date range: current month
const today = new Date();
const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  .toISOString()
  .split("T")[0];
const todayStr = today.toISOString().split("T")[0];

const Reports = () => {
  const { formatCurrency } = useCurrency();

  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);

  const [reportStats, setReportStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalDiscount: 0,
  });
  const [salesHistory, setSalesHistory] = useState([]);
  const [topSelling, setTopSelling] = useState([]);

  const fetchReportData = useCallback(async (start, end) => {
    setLoading(true);
    try {
      const [statsRes, historyRes, topRes] = await Promise.all([
        orderService.getReportStats(start, end),
        orderService.getOrderHistory(start, end),
        orderService.getTopSelling(start, end),
      ]);

      if (statsRes.success) setReportStats(statsRes.data);
      if (historyRes.success) setSalesHistory(historyRes.data);
      if (topRes.success) setTopSelling(topRes.data);
    } catch (err) {
      notify.error(err.response?.data?.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount with default range
  useEffect(() => {
    fetchReportData(startDate, endDate);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = () => {
    if (!startDate || !endDate) {
      notify.error("Please select both start and end dates");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      notify.error("Start date cannot be after end date");
      return;
    }
    fetchReportData(startDate, endDate);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header + Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Sales &amp; Inventory Reports
          </h1>
          <p className="text-gray-500 text-sm">Analyze your business performance.</p>
        </div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-white p-3 md:p-2 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-auto">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 w-full md:w-auto flex-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-sm md:text-xs font-bold text-gray-700 outline-none cursor-pointer flex-1 text-right md:text-left min-w-[120px]"
            />
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 w-full md:w-auto flex-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">End Date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-sm md:text-xs font-bold text-gray-700 outline-none cursor-pointer flex-1 text-right md:text-left min-w-[120px]"
            />
          </div>
          <button
            onClick={handleFilter}
            disabled={loading}
            className="w-full md:w-auto justify-center bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-60 shrink-0"
          >
            <Filter size={16} />
            {loading ? "..." : "Filter"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
          <h3 className="text-2xl font-bold text-emerald-600">{formatCurrency(reportStats.totalRevenue)}</h3>
          <span className="text-[10px] text-gray-400 font-medium mt-1">For selected period</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-900">{reportStats.totalOrders}</h3>
          <span className="text-[10px] text-gray-400 font-medium mt-1">Transactions completed</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Discounts</p>
          <h3 className="text-2xl font-bold text-orange-600">{formatCurrency(reportStats.totalDiscount)}</h3>
          <span className="text-[10px] text-gray-400 font-medium mt-1">Savings given to customers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sales History</h3>
          <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-6 bg-gray-50 rounded-2xl animate-pulse">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            )}
            {!loading && salesHistory.length === 0 && (
              <p className="text-sm text-gray-400 italic">No sales found for selected period.</p>
            )}
            {!loading && salesHistory.map((order, index) => {
              const orderNumber = index + 1;
              const customerName = order.customerId?.name || "Walk-in Customer";
              const date = new Date(order.createdAt).toLocaleString();
              return (
                <div key={order._id} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-emerald-600">
                        <ShoppingBag size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Order #{orderNumber}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {customerName} • {date}
                        </p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                          BILLED BY: {order.billedBy}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">
                          {item.name} {item.size ? `(${item.size})` : ""} x {item.qty}
                        </span>
                        <span className="text-gray-900 font-bold">
                          {formatCurrency(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs font-bold text-gray-500 uppercase">Subtotal</span>
                      <span className="text-sm font-bold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {loading && (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-2.5 w-16 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            )}
            {!loading && topSelling.length === 0 && (
              <p className="text-sm text-gray-400 italic">No sales data available for selected period.</p>
            )}
            {!loading && topSelling.map((p, idx) => (
              <div
                key={p.productId || idx}
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-100">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{p.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">{p.sold} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{formatCurrency(p.revenue)}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
