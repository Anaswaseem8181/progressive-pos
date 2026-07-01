import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Menu, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Header = ({ onLoginClick, onGetStartedClick }) => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
              {user?.businessName || "Progressive POS"}
            </span>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onLoginClick}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={onGetStartedClick}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 duration-200 flex items-center gap-2"
            >
              Get Started
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <div className="pt-6 grid grid-cols-2 gap-4 px-3">
                <button
                  onClick={() => {
                    onLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-4 text-center font-bold text-slate-600 bg-slate-50 rounded-2xl active:scale-95 transition-all"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    onGetStartedClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-4 text-center font-bold text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-100 active:scale-95 transition-all"
                >
                  Join Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
