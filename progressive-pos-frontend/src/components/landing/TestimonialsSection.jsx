import { testimonials } from '../../data';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-slate-900 text-white selection:bg-indigo-500/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">Trusted by growing businesses</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Don't just take our word for it</h3>
          <p className="text-lg text-slate-400">
            See how merchants across the globe are scaling their retail operations with software that gets out of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition-colors duration-300 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-600"
                        }`}
                    />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-8 italic">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${testimonial.color}`}>
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.author}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
