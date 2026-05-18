import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, X } from "lucide-react";

const WarningModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Yes, Proceed",
  cancelText = "No, Go Back",
  variant = "danger"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${variant === "danger" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
                  }`}>
                  <AlertCircle size={28} />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {message}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all active:scale-[0.98]"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all active:scale-[0.98] shadow-lg ${variant === "danger"
                    ? "bg-red-500 hover:bg-red-600 shadow-red-200"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                    }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WarningModal;
