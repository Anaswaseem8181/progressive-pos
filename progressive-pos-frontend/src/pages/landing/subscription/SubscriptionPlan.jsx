import { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

import { PlanCard } from "../../../components/subscription/PlanCard.jsx";
import { subscriptionPlans } from "../../../data/index.js";
import { useAuth } from "../../../hooks/useAuth.js";
import WarningModal from "../../../components/modals/common/WarningModal";
import BackgroundDecoration from "../../../components/common/BackgroundDecoration.jsx";
import SubscriptionHeader from "../../../components/subscription/SubscriptionHeader.jsx";
import TrustBadges from "../../../components/subscription/TrustBadges.jsx";

const Subscription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const registrationData = location.state?.registrationData;
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }
    if (!registrationData) {
      navigate("/register");
    }
  }, [registrationData, isAuthenticated, navigate]);

  const handleSelect = (plan) => {
    navigate("/payment", { state: { plan, registrationData } });
  };

  const handleBack = () => {
    setShowCancelModal(true);
  };

  const confirmBack = () => {
    navigate("/register", { state: { registrationData } });
  };

  const renderedPlans = useMemo(() => {
    return subscriptionPlans.map((plan, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 + (index * 0.15), ease: "easeOut" }}
      >
        <PlanCard
          {...plan}
          onSelect={() => handleSelect(plan)}
        />
      </motion.div>
    ));
  }, [registrationData]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans py-12 px-4 flex flex-col items-center justify-center">
      <BackgroundDecoration />

      <button
        onClick={handleBack}
        className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 font-bold text-sm"
      >
        <ArrowLeft size={16} />
        Back to Registration
      </button>

      <SubscriptionHeader registrationData={registrationData} />

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">
        {renderedPlans}
      </div>

      <TrustBadges delay={1} />

      <WarningModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmBack}
        title="Change Registration Details?"
        message="Are you sure you want to go back? You'll need to confirm your details again, though we'll keep them filled for you."
        confirmText="Yes, Go Back"
        cancelText="Keep Going"
        variant="warning"
      />
    </div>
  );
};

export default Subscription;