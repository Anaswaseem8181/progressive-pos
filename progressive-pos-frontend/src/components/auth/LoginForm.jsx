import { useState } from "react";
import { motion } from "motion/react";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AuthHeader from "../common/AuthHeader.jsx";
import { InputField } from "../ui/InputField.jsx";

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  isLoading,
  businessName,
  onForgotPassword
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <AuthHeader
          badge="Security Portal"
          title="Account Login"
          subtitle={businessName ? (
            <>Welcome back to <span className="text-slate-900 font-bold">{businessName}</span></>
          ) : "Sign in to manage your business operations."}
        />

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Business Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
            placeholder="admin@company.com"
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            placeholder="••••••••"
            required
          />

          <div className="flex justify-end -mt-2">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 border-2 border-slate-900 text-white py-4 px-8 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 hover:border-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Access Account
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-bold text-slate-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            Create Account
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default LoginForm;
