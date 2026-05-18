import { motion } from "motion/react";

const AuthHeader = ({ badge, title, subtitle, className = "" }) => {
  return (
    <div className={`mb-10 text-center lg:text-left ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6 font-black text-[10px] text-blue-600 uppercase tracking-[0.2em]"
        >
          {badge}
        </motion.div>
      )}
      <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">
        {title}
      </h2>
      <p className="text-slate-500 font-medium">
        {subtitle}
      </p>
    </div>
  );
};

export default AuthHeader;
