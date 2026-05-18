import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, X, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { InputField } from "../../ui/InputField.jsx";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    // Reset state after animation finishes
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                  isSubmitted ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500"
                }`}>
                  {isSubmitted ? <CheckCircle2 size={28} /> : <Mail size={28} />}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {!isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key="form-content"
                >
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Recovery
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900">
                        Forgot Password?
                    </h3>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail size={18} />}
                      required
                    />

                    <button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending Link...
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key="success-content"
                  className="text-left"
                >
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Check your email
                  </h3>
                  <p className="text-slate-500 leading-relaxed mb-8">
                    We've sent a password reset link to <span className="font-bold text-slate-900">{email}</span>. Please check your inbox and spam folder.
                  </p>

                  <button
                    onClick={handleClose}
                    className="w-full py-4 px-6 rounded-2xl text-slate-600 font-bold text-sm bg-slate-50 hover:bg-slate-100 transition-all active:scale-[0.98]"
                  >
                    Back to Login
                  </button>
                  
                  <p className="mt-6 text-center text-sm text-slate-400 font-medium">
                    Didn't receive the email?{" "}
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Try again
                    </button>
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
