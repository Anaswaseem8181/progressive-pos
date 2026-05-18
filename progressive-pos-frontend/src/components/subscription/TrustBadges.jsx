import React from "react";
import { motion } from "motion/react";
import { trustBadges } from "../../data";

const TrustBadges = ({ delay = 1 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="mt-20 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
    >
      {trustBadges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div key={index} className="flex items-center gap-2 font-bold text-slate-900">
            <Icon size={20} className="text-blue-600" />
            {badge.text}
          </div>
        );
      })}
    </motion.div>
  );
};

export default TrustBadges;
