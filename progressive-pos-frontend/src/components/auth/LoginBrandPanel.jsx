import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackgroundDecoration from "../common/BackgroundDecoration";
import { loginBenefits } from "../../data";

const LoginBrandPanel = () => {
  const navigate = useNavigate();

  return (
    <>
      <BackgroundDecoration variant="dark" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-20 pointer-events-none">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <ShoppingCart size={28} />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Progressive POS</span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-black text-white leading-tight mb-8">
            Welcome back to your <br />
            <span className="text-blue-500 underline decoration-blue-500/30 decoration-8 underline-offset-[12px]">digital hub.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-sm mb-12">
            Access your inventory, sales, and analytics from anywhere in the world.
          </p>

          <div className="space-y-4">
            {loginBenefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="flex items-center gap-3 text-slate-300 font-bold">
                  <Icon size={20} className="text-blue-500" />
                  {benefit.text}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 pt-10 border-t border-slate-800">
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
          Ready to start? <button onClick={() => navigate("/register")} className="text-blue-500 hover:text-blue-400 transition-colors ml-2 underline">Create an account</button>
        </p>
      </div>
    </>
  );
};

export default LoginBrandPanel;
