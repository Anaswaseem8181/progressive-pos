import { motion } from "motion/react";
import { Check, Zap, Rocket, Star } from "lucide-react";
import { saasCurrency } from "../../data";

export const PlanCard = ({ title, price, duration, features, highlighted, onSelect }) => {
  const currency = saasCurrency;

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative rounded-[2.5rem] p-8 lg:p-10 shadow-2xl overflow-hidden transition-all duration-500 border-2 ${highlighted
        ? "bg-slate-900 text-white border-blue-500/30"
        : "bg-white/80 backdrop-blur-xl text-slate-800 border-white/20"
        }`}
    >
      {!highlighted && (
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
      )}

      {highlighted && (
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -z-10" />
      )}

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${highlighted ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
            }`}>
            {title.toLowerCase().includes("pro") ? <Rocket size={28} /> : (highlighted ? <Star size={28} /> : <Zap size={28} />)}
          </div>
          <h3 className="text-2xl font-black tracking-tight">{title}</h3>
        </div>
        {highlighted && (
          <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg shadow-blue-500/30">
            Recommended
          </span>
        )}
      </div>

      <div className="mb-8 flex items-baseline gap-1">
        <span className="text-sm font-bold opacity-60 uppercase">{currency}</span>
        <span className="text-6xl font-black tracking-tighter">{price}</span>
        <span className={`text-sm font-medium ${highlighted ? "text-blue-300" : "text-slate-400"}`}>/{duration}</span>
      </div>

      <div className={`h-px w-full mb-8 ${highlighted ? "bg-white/10" : "bg-slate-100"}`} />

      <ul className="space-y-4 mb-10 min-h-[160px]">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 group">
            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${highlighted ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600"
              }`}>
              <Check size={12} strokeWidth={4} />
            </div>
            <span className={`text-sm font-semibold tracking-wide ${highlighted ? "text-slate-300" : "text-slate-600"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl active:scale-[0.98] ${highlighted
          ? "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/40"
          : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-200"
          }`}
      >
        Start with {title}
      </button>

      <p className={`mt-6 text-center text-[10px] font-bold uppercase tracking-widest ${highlighted ? "text-slate-500" : "text-slate-400"}`}>
        Cancel anytime • No hidden fees
      </p>
    </motion.div>
  );
};
