import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

/**
 * SubscriptionHeader - Presentational component for the subscription page header.
 */
const SubscriptionHeader = ({ registrationData }) => {
  return (
    <div className="max-w-4xl w-full text-center mb-16 relative z-10">
      {registrationData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8"
        >
          <Sparkles size={16} className="text-blue-600" />
          <span className="text-xs font-black text-blue-700 uppercase tracking-widest">
            Welcome, {registrationData.name}!
          </span>
        </motion.div>
      )}

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
      >
        Fuel your growth with the <br /> 
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          perfect business plan.
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-slate-500 font-medium max-w-2xl mx-auto"
      >
        Setting up <span className="text-slate-900 font-bold underline decoration-blue-500/30 decoration-4">{registrationData?.businessName}</span> has never been easier. Pick a plan that fits your current needs and scale when you're ready.
      </motion.p>
    </div>
  );
};

export default SubscriptionHeader;
