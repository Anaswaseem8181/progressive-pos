import { steps } from '../../data';

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative dashed line for desktop */}
      <div className="hidden lg:block absolute top-[55%] left-0 w-full h-[2px] border-b-2 border-dashed border-slate-200 -z-10 blur-[1px]"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Progressive POS Works</h2>
          <p className="text-lg text-slate-600">
            Get up and running in minutes, not days. We've designed our system to be intuitive from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center group">
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white ${step.bgColor} group-hover:scale-110 transition-transform duration-500 relative`}>
                    <Icon className={`w-10 h-10 ${step.color}`} />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center border-4 border-white shadow-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
