import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "motion/react";
import { CheckCircle2, CreditCard, Lock, Loader2 } from "lucide-react";
import { cardElementOptions } from "../../data";
import authService from "../../api/authService";

const CheckoutForm = ({ plan, initialData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setStatus("loading");
    setErrorMsg("");

    const cardElement = elements.getElement(CardElement);

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { name, email },
    });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    console.log("PaymentMethod created:", paymentMethod.id);

    try {
      // Call backend with generated Stripe payment method ID for secure server-side validation
      await authService.subscribe({
        plan: plan?.id || 'monthly',
        paymentMethodId: paymentMethod.id
      });

      // Clear temporary user data from localStorage before directing to login
      authService.logout();

      setStatus("success");
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus("error");
      const errorMessage = err.response?.data?.message || err.message || "Failed to activate subscription. Please contact support.";
      setErrorMsg(errorMessage);
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-24 h-24 rounded-3xl bg-blue-50 flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 bg-blue-400/20 rounded-3xl blur-xl animate-pulse" />
          <CheckCircle2 className="w-12 h-12 text-blue-600 relative z-10" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Activation Complete!</h3>
        <p className="text-slate-500 mb-1 font-medium">
          Your account is now ready with the <span className="text-blue-600 font-bold">{plan?.title}</span> plan.
        </p>
        <p className="text-sm text-slate-400 mb-10">
          You can now log in to start managing your business.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="w-full px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-[0.98]"
        >
          Login to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="group">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-blue-600">Cardholder Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="John Doe"
          className="block w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold placeholder-slate-300 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
        />
      </div>

      <div className="group">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-blue-600">Email Address</label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="john@example.com"
          className="block w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-semibold placeholder-slate-300 focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
        />
      </div>

      <div className="group">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 transition-colors group-focus-within:text-blue-600">Card Information</label>
        <div
          className={`w-full px-5 py-4.5 bg-slate-50 border-2 rounded-2xl transition-all ${cardComplete ? "border-blue-600 bg-white shadow-md shadow-blue-50" : "border-slate-100"
            }`}
        >
          <CardElement
            options={cardElementOptions}
            onChange={(event) => {
              setCardComplete(event.complete);
              if (event.error) setErrorMsg(event.error.message);
              else setErrorMsg("");
            }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-blue-500" />
            PCI-DSS Compliant
          </p>
          <div className="flex gap-2">
            <div className="w-8 h-5 bg-slate-100 rounded-sm" />
            <div className="w-8 h-5 bg-slate-100 rounded-sm" />
            <div className="w-8 h-5 bg-slate-100 rounded-sm" />
          </div>
        </div>
      </div>

      {/* <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
             <CreditCard size={20} />
        </div>
        <div className="text-xs text-blue-700 leading-relaxed font-medium">
          <p className="font-black uppercase tracking-widest text-[10px] mb-1">Test Mode Active</p>
          Use <span className="font-black select-all">4242 4242 4242 4242</span> with any future expiry and any 3-digit CVC to test.
        </div>
      </div> */}

      {status === "error" && errorMsg && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-red-600 text-xs font-bold bg-red-50 border border-red-100 rounded-xl px-4 py-3"
        >
          {errorMsg}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={!stripe || status === "loading" || !cardComplete || !name || !email}
        className="w-full py-5 rounded-2xl font-black text-sm text-white uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98]"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Verifying...
          </>
        ) : (
          <>Activate {plan?.title}</>
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
