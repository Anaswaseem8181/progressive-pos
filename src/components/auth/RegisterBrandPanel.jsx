import React from "react";
import { motion } from "motion/react";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import BackgroundDecoration from "../common/BackgroundDecoration";
import { registerFeatures } from "../../data";

const RegisterBrandPanel = () => {
  return (
    <>
      <BackgroundDecoration variant="dark" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16 group pointer-events-none">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl group-hover:rotate-12 transition-transform duration-500 text-2xl font-black">
            <ShoppingCart size={28} />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Progressive POS</span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-8">
            Transform your store into a <span className="text-blue-200">digital powerhouse.</span>
          </h1>
          <p className="text-xl text-blue-100/90 leading-relaxed max-w-lg mb-12 font-medium">
            Join over 2,000+ businesses who have modernized their inventory and sales operations with our all-in-one POS solution.
          </p>

          <div className="space-y-6">
            {registerFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                className="flex items-center gap-4 group"
              >
                <div className="w-6 h-6 rounded-full bg-blue-400/30 flex items-center justify-center text-blue-200 group-hover:bg-blue-400/50 transition-colors duration-300">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-blue-50 font-semibold tracking-wide">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 pt-12 border-t border-white/10 flex items-center gap-6">
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((avatar, index) => (
            <div key={index} className="w-10 h-10 rounded-full border-2 border-indigo-600 bg-indigo-500" />
          ))}
        </div>
        <p className="text-blue-100 text-sm font-medium">
          Trusted by industry leaders worldwide
        </p>
      </div>
    </>
  );
};

export default RegisterBrandPanel;
