import React from "react";
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

/**
 * OrderSummary - Presentational component for the left panel of the payment page.
 */
const OrderSummary = ({ plan, registrationData, saasCurrency, handleBack }) => {
  return (
    <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
      
      <div className="relative z-10">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest mb-12"
          >
            <ArrowLeft size={16} /> Change Plan
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Premium Access</span>
          </div>

          <h2 className="text-4xl font-black mb-2 tracking-tight">{plan?.title ?? "Subscription"}</h2>
          <p className="text-slate-400 font-medium mb-10">
            {registrationData?.businessName || "Progressive POS"} Cloud
          </p>

          <div className="mb-12 flex items-baseline gap-1">
              <span className="text-sm font-bold opacity-50 uppercase tracking-wider">{saasCurrency}</span>
              <span className="text-7xl font-black tracking-tighter">{plan?.price}</span>
              <span className="text-sm font-bold text-slate-500">/{plan?.duration}</span>
          </div>

          <ul className="space-y-4">
            {plan?.features?.map((feature, index) => (
              <li key={index} className="flex items-center gap-4 group">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <CheckCircle2 size={14} strokeWidth={3} />
                </div>
                <span className="text-sm font-semibold tracking-wide text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>
      </div>

      <div className="relative z-10 mt-16 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
                <ShieldCheck size={24} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-tight">
                Stripe Secure <br />
                Checkout
              </p>
          </div>
      </div>
    </div>
  );
};

export default OrderSummary;
