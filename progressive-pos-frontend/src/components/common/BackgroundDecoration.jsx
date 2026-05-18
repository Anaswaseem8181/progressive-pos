import { motion } from "motion/react";

const BackgroundDecoration = ({ variant = "default" }) => {
  const isDark = variant === "dark";

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] 
            ${isDark ? "bg-blue-950/20" : "bg-blue-100/50"}`}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className={`absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] 
            ${isDark ? "bg-indigo-950/20" : "bg-indigo-100/50"}`}
      />

      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] bg-blue-400/5 mix-blend-overlay animate-pulse" />
    </div>
  );
};

export default BackgroundDecoration;
