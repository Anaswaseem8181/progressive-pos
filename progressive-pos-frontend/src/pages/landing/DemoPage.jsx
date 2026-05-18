import { useState } from "react";
import { ArrowLeft, MonitorPlay, Maximize2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { demoScreenshots } from "../../data";
import Footer from "../../components/common/Footer";
import { Button } from "../../components/ui/Button";

const DemoPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-slate-600 hover:text-blue-600 font-medium transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </button>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 hidden sm:block">
                Progressive POS <span className="text-blue-600">Platform Tour</span>
              </span>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate('/login')}>
              Live Platform
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center justify-center rounded-full bg-blue-100 px-3 py-1 mb-6">
          <MonitorPlay className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-semibold text-blue-600 tracking-wide">Interactive Gallery</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">
          A Look Inside the System
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore the beautifully crafted interfaces powering modern retail. Detailed layouts for Admins, Managers, and Cashiers.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          {demoScreenshots.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
              key={item.id}
              className="group relative bg-[#F8FAFC] backdrop-blur-sm rounded-[2rem] p-3 border border-slate-200/60 shadow-sm hover:shadow-2xl hover:border-slate-300/80 transition-all duration-500 ease-out"
              title={item.title}
            >
              <div
                className="relative w-full h-full cursor-pointer bg-slate-100/50 rounded-[1.5rem] overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] aspect-[4/3] flex items-center justify-center transition-colors duration-500 group-hover:bg-slate-900/90"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.imagePath}
                  alt={item.title}
                  className="w-full h-full object-contain p-6 md:p-8 transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-100 scale-95"
                  loading="lazy"
                />

                <div className="absolute inset-x-0 bottom-0 top-[40%] bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 border-b-0 pointer-events-none rounded-b-[1.5rem]">
                  <div className="translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75 flex flex-col gap-3">
                    <span className="text-[10px] font-bold px-3 py-1 w-max bg-blue-500/20 text-blue-300 rounded-full uppercase tracking-widest backdrop-blur-md border border-blue-400/20">
                      {item.category}
                    </span>
                    <p className="text-slate-200 leading-relaxed text-sm md:text-base font-medium drop-shadow-md">
                      {item.description}
                    </p>
                    <div className="mt-3 flex items-center text-white/80 text-sm font-bold tracking-tight uppercase group-hover:text-white transition-colors w-max">
                      <Maximize2 className="w-4 h-4 mr-2" /> Open Fullscreen
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                  <div className="bg-white backdrop-blur-md text-black px-5 py-2.5 rounded-2xl text-sm font-bold shadow-2xl border border-white/10 flex items-center gap-2 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] whitespace-nowrap">
                    {item.title}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Image Modal Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 sm:p-6 backdrop-blur-md bg-slate-900/80"
            onClick={() => setSelectedImage(null)}
          >
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <button
                onClick={() => setSelectedImage(null)}
                className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-lg rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedImage.title}</h3>
                  <p className="text-sm text-slate-500">{selectedImage.description}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wide hidden sm:block">
                  {selectedImage.category}
                </span>
              </div>
              <div className="flex-1 overflow-auto bg-slate-200 p-2 sm:p-4 flex items-center justify-center min-h-[50vh]">
                <img
                  src={selectedImage.imagePath}
                  alt={selectedImage.title}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-sm"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default DemoPage;
