import { features } from '../../data';

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <h2 className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">Capabilities</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to run your store</h3>
          <p className="text-lg text-slate-600">
            Progressive POS brings together the best tools for inventory management, sales tracking, and customer relationship building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.name}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.name}</h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
