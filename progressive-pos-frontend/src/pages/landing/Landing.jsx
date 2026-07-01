import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import HeroSection from '../../components/landing/HeroSection';
import FeaturesSection from '../../components/landing/FeaturesSection';
import HowItWorkSection from '../../components/landing/HowItWorkSection';
import PwaHighlightSection from '../../components/landing/PwaHighlightSection';
import TestimonialsSection from '../../components/landing/TestimonialsSection';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleGetStartedClick = () => {
    navigate('/register');
  };

  const handleDemoClick = () => {
    navigate('/demo');
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 flex flex-col overflow-x-hidden">
      <Header onLoginClick={handleLoginClick} onGetStartedClick={handleGetStartedClick} />

      <main className="flex-grow pt-16">
        <HeroSection onCtaClick={handleGetStartedClick} onDemoClick={handleDemoClick} />
        <FeaturesSection />
        <HowItWorkSection />
        <PwaHighlightSection />
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
