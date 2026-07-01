import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saasCurrency } from "../../../data";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import WarningModal from "../../../components/modals/common/WarningModal";
import AuthSplitLayout from "../../../components/common/AuthSplitLayout";
import AuthHeader from "../../../components/common/AuthHeader";
import BackgroundDecoration from "../../../components/common/BackgroundDecoration";
import OrderSummary from "../../../components/subscription/OrderSummary";
import CheckoutForm from "../../../components/subscription/CheckoutForm";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;
  const registrationData = location.state?.registrationData;

  const { isAuthenticated } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }
    if (!plan) {
      navigate("/subscription");
    }
  }, [plan, isAuthenticated, navigate]);

  const handleBack = () => {
      setShowCancelModal(true);
  };

  const confirmBack = () => {
      navigate("/subscription", { state: { registrationData } });
  };

  const SummaryPanel = (
    <OrderSummary 
      plan={plan} 
      registrationData={registrationData} 
      saasCurrency={saasCurrency} 
      handleBack={handleBack} 
    />
  );

  const InputPanel = (
    <div className="w-full">
      <BackgroundDecoration />
      <div className="bg-white/80 backdrop-blur-xl border-2 border-white rounded-[2.5rem] p-10 shadow-2xl relative z-10">
        <AuthHeader 
          title="Checkout"
          subtitle="Verify your details and complete activation."
        />
        <Elements stripe={stripePromise}>
          <CheckoutForm plan={plan} initialData={registrationData} />
        </Elements>
      </div>

      <p className="mt-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <Lock size={12} />
          Secure encrypted transaction
      </p>

      <WarningModal 
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmBack}
        title="Cancel Payment?"
        message="Are you sure you want to go back? Your current payment progress will be cleared, though your registration is safe."
        confirmText="Yes, Go Back"
        cancelText="Continue Payment"
        variant="warning"
      />
    </div>
  );

  return (
    <AuthSplitLayout 
      leftContent={SummaryPanel} 
      rightContent={InputPanel} 
      leftWidth="lg:col-span-12" 
      className="bg-slate-50"
    />
  );
};

export default PaymentPage;
