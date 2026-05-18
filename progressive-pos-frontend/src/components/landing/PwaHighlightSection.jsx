import React from 'react';
import { Smartphone, Download, Database, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

const PwaHighlightSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

          <div className="mb-16 lg:mb-0">
            <h2 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-3 text-left">Progressive Web App</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              An app-like experience without the App Store
            </h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Progressive POS utilizes modern web technology to deliver a native app experience. Install it directly to your home screen and enjoy blistering fast performance, even when your internet connection drops.
            </p>

            <dl className="mt-10 space-y-8">
              <div className="flex gap-4">
                <div className="flex bg-indigo-100 w-12 h-12 rounded-xl items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <dt className="text-lg font-semibold text-slate-900">Seamless Offline Mode</dt>
                  <dd className="mt-2 text-slate-600 leading-relaxed text-base">Local caching means you can continue checking out customers and viewing inventory while offline. We sync everything when you're back online.</dd>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex bg-indigo-100 w-12 h-12 rounded-xl items-center justify-center flex-shrink-0">
                  <Download className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <dt className="text-lg font-semibold text-slate-900">One-tap Installation</dt>
                  <dd className="mt-2 text-slate-600 leading-relaxed text-base">Skip the slow app store downloads. Add our POS directly to your device home screen, and it behaves exactly like a native application.</dd>
                </div>
              </div>
            </dl>

            <div className="mt-10">
              <Button size="lg" className="shadow-lg shadow-indigo-600/20 bg-indigo-600 hover:bg-indigo-700">
                <Zap className="mr-2 h-5 w-5" /> Experience It Now
              </Button>
            </div>
          </div>

          {/* Graphical abstraction instead of an image */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative rounded-3xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:rounded-3xl shadow-xl">
              <div className="rounded-2xl bg-white p-4 pb-0 h-full w-full overflow-hidden border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">P</div>
                    <div className="font-semibold text-slate-800">Progressive POS</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </div>
                </div>

                {/* Mock UI Rows */}
                <div className="space-y-4 pb-4">
                  <div className="h-24 rounded-lg bg-slate-50 border border-slate-100 p-4 flex gap-4 animate-pulse">
                    <div className="w-16 h-16 rounded bg-slate-200"></div>
                    <div className="flex flex-col gap-2 flex-grow justify-center">
                      <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-24 rounded-lg bg-slate-50 border border-slate-100 p-4 flex gap-4 animate-pulse">
                    <div className="w-16 h-16 rounded bg-slate-200"></div>
                    <div className="flex flex-col gap-2 flex-grow justify-center">
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="h-24 rounded-lg bg-slate-50 border border-slate-100 p-4 flex gap-4 animate-pulse opacity-50">
                    <div className="w-16 h-16 rounded bg-slate-200"></div>
                    <div className="flex flex-col gap-2 flex-grow justify-center">
                      <div className="h-4 bg-slate-200 rounded w-2/5"></div>
                      <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>

                {/* Floating offline popover mock */}
                <div className="absolute bottom-6 left-6 right-6 bg-slate-900 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between transform transition-transform border border-slate-700 backdrop-blur-sm bg-opacity-90">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-medium">Install app to home screen</span>
                  </div>
                  <div className="text-xs font-bold bg-white text-slate-900 px-3 py-1.5 rounded-lg cursor-pointer">Install</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PwaHighlightSection;
