import { Calendar, Filter, DollarSign, ShoppingBag, Tag, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useSales } from "../../hooks/useSales";
import { useCurrency } from "../../hooks/useCurrency";

const Reports = () => {
  const { sales, topSelling, getTotalRevenue } = useSales();
  const { formatCurrency } = useCurrency();
  const totalRevenue = getTotalRevenue();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sales &amp; Inventory Reports</h1>
          <p className="text-gray-500 text-sm">Analyze your business performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Start Date</span>
            <input type="date" className="bg-transparent text-xs font-bold text-gray-700 outline-none" defaultValue="2026-03-25" />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase">End Date</span>
            <input type="date" className="bg-transparent text-xs font-bold text-gray-700 outline-none" defaultValue="2026-04-01" />
          </div>
          <button className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-600 transition-all">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
          <h3 className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</h3>
          <span className="text-[10px] text-gray-400 font-medium mt-1">For selected period</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-900">{sales.length}</h3>
          <span className="text-[10px] text-gray-400 font-medium mt-1">Transactions completed</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Discounts</p>
          <h3 className="text-2xl font-bold text-orange-600">{formatCurrency(3020)}</h3>
          <span className="text-[10px] text-gray-400 font-medium mt-1">Savings given to customers</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sales History</h3>
          <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
            {sales.map((order) => (
              <div key={order.id} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-emerald-600">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Order #{order.id}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {order.customer} • {order.date}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                        BILLED BY: {order.billedBy}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-emerald-600">{formatCurrency(order.amount)}</span>
                  </div>
                </div>
                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">{item.name} x {item.qty}</span>
                      <span className="text-gray-900 font-bold">{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-500 uppercase">Subtotal</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(order.amount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topSelling.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100">
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
