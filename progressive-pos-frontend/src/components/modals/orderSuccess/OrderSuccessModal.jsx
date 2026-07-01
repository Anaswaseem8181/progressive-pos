import React from "react";
import { Check, Printer, ArrowRight, MapPin, Phone, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "../../../hooks/useCurrency";
import { useAuth } from "../../../hooks/useAuth";

const OrderSuccessModal = ({ isOpen, onClose, sale }) => {
  const { formatCurrency } = useCurrency();
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ willChange: "transform, opacity" }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Success Status Bar */}
          <div className="bg-emerald-500 py-3 px-8 flex items-center justify-center gap-3 text-white">
             <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <Check size={12} strokeWidth={3} />
             </div>
             <span className="text-[10px] font-bold tracking-widest uppercase">Transaction Successful</span>
          </div>

          <div className="p-6 pb-8">
            {/* Receipt Card */}
            <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-6 shadow-inner relative overflow-hidden">
               {/* Decorative Receipt Notch */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-slate-200 rounded-b-full" />
               
               {/* Business Info */}
               <div className="text-center mb-6">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{user?.businessName || "Progressive POS"}</h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Smart Retail Solution</p>
                  
                  <div className="flex flex-col items-center gap-1 mt-3 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                     <span className="flex items-center gap-1"><MapPin size={10} className="text-emerald-500 shrink-0" /> {user?.storeAddress || "123 Tech Avenue, Silicon Valley"}</span>
                     <span className="flex items-center gap-1"><Phone size={10} className="text-emerald-500 shrink-0" /> {user?.contactNumber || "+1 (555) 000-1234"}</span>
                  </div>
               </div>

               {/* Order Info Bar */}
               <div className="flex items-center justify-between py-2.5 border-y border-dashed border-slate-200 mb-4">
                  <div className="flex flex-col">
                     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Receipt</span>
                     <span className="text-[10px] font-black text-slate-900">#ORD-{sale?.id?.toString().padStart(4, '0')}</span>
                  </div>
                  <div className="flex flex-col text-right">
                     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Date</span>
                     <span className="text-[10px] font-black text-slate-900">{sale?.date}</span>
                  </div>
               </div>

               {/* Itemized Table */}
               <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 mb-1">
                     <span className="w-1/2">Description</span>
                     <span className="w-1/4 text-center">Qty</span>
                     <span className="w-1/4 text-right">Total</span>
                  </div>

                  <div className="relative -mx-2">
                    <div className="space-y-2 max-h-[220px] overflow-y-auto px-2 py-1 custom-scrollbar overscroll-contain">
                       {sale?.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                             <div className="w-1/2 flex flex-col min-w-0">
                                <span className="text-xs font-bold text-slate-800 leading-tight truncate">{item.name}</span>
                                <span className="text-[9px] text-slate-400 font-medium tracking-tight">{formatCurrency(item.price)} ea</span>
                             </div>
                             <span className="w-1/4 text-center text-xs font-black text-slate-700">x{item.qty}</span>
                             <span className="w-1/4 text-right text-xs font-black text-slate-900">{formatCurrency(item.price * item.qty)}</span>
                          </div>
                       ))}
                    </div>
                  </div>
               </div>

               {/* Totals Section */}
               <div className="border-t border-dashed border-slate-200 pt-4 space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                     <span>Subtotal</span>
                     <span className="text-slate-900">{formatCurrency(sale?.amount || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-slate-100">
                     <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Grand Total</span>
                     <span className="text-xl font-black text-emerald-600 tracking-tight">{formatCurrency(sale?.amount || 0)}</span>
                  </div>
               </div>

               {/* Footer Branding */}
               <div className="mt-6 flex flex-col items-center">
                  <div className="w-full h-6 flex items-center justify-between gap-0.5 mb-3">
                     {[...Array(24)].map((_, i) => (
                        <div key={i} className={`bg-slate-200 w-1 ${i % 3 === 0 ? 'h-full' : 'h-2/3'}`} />
                     ))}
                  </div>
                  <p className="text-center text-[8px] font-bold text-slate-300 uppercase tracking-[0.3em]">Thank you for shopping</p>
               </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 active:scale-[0.98]"
              >
                <ArrowRight size={16} />
                New Order
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderSuccessModal;
