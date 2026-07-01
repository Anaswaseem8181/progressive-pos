import { ArrowRight, BarChart3, Package, Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';

const HeroSection = ({ onCtaClick, onDemoClick }) => {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-24 lg:pt-32 lg:pb-36">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-indigo-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] transition-all duration-1000 ease-in-out"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out fill-mode-both">
          <div className="inline-flex self-center items-center justify-center rounded-full bg-blue-50/50 px-3 py-1 mb-8 border border-blue-100">
            <span className="text-sm font-medium text-blue-600 flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              The modern standard for retail & wholesale
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
            Smart Inventory Management <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              for Modern Businesses
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to track sales, manage inventory, and analyze growth all in one lightning-fast, offline capable app.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={onCtaClick} className="group w-full sm:w-auto">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="secondary" size="lg" onClick={onDemoClick} className="w-full sm:w-auto">
              View Demo
            </Button>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-500 mb-6 font-medium tracking-wide uppercase">Built for performance</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <Package className="h-6 w-6 text-blue-600" />
                Real-time Tracking
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <Smartphone className="h-6 w-6 text-blue-600" />
                Works Offline
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Advanced Analytics
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
