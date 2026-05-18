import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Building2, User, Mail, Lock, Phone, Globe, Loader2 } from "lucide-react";
import { InputField } from "../ui/InputField";
import { SelectField } from "../ui/SelectField";
import { businessCategory } from "../../data";
import AuthHeader from "../common/AuthHeader";
import WarningModal from "../modals/common/WarningModal";

const RegisterForm = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isLoading,
  showCancelModal,
  handleCancel,
  confirmCancel,
  closeCancelModal
}) => {
  return (
    <div className="w-full max-w-xl">
      <button
        onClick={handleCancel}
        className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 font-bold text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AuthHeader
          badge="Join Us"
          title="Create your account"
          subtitle="Join our community and modernize your business."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
          <div className="md:col-span-2 mb-2">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Personal Information</p>
          </div>

          <InputField label="Full Name" name="name" register={register} errors={errors} icon={<User size={18} />} placeholder="Enter your full name" />
          <InputField label="Email Address" name="email" type="email" register={register} errors={errors} icon={<Mail size={18} />} placeholder="name@company.com" />
          <InputField label="Password" name="password" type="password" register={register} errors={errors} icon={<Lock size={18} />} placeholder="Min. 6 characters" />
          <InputField label="Confirm Password" name="confirmPassword" type="password" register={register} errors={errors} icon={<Lock size={18} />} placeholder="Repeat password" />
          <div className="md:col-span-2">
            <InputField label="Contact Number" name="contactNumber" register={register} errors={errors} icon={<Phone size={18} />} placeholder="+1 (555) 000-0000" />
          </div>

          <div className="md:col-span-2 mt-4 mb-2">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Business Details</p>
          </div>

          <InputField label="Business Name" name="businessName" register={register} errors={errors} icon={<Building2 size={18} />} placeholder="My Awesome Store" />
          <SelectField
            label="Business Category"
            name="businessCategory"
            register={register}
            errors={errors}
            options={businessCategory}
          />
          <div className="md:col-span-2">
            <InputField label="Store Address" name="storeAddress" register={register} errors={errors} icon={<Globe size={18} />} placeholder="123 Street, City, Country" />
          </div>

          <div className="md:col-span-2">
            <InputField label="Default Currency" name="currency" register={register} errors={errors} placeholder="e.g. PKR, USD, EUR" />
          </div>

          <div className="md:col-span-2 mt-8 flex flex-col-reverse sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-4 px-6 rounded-2xl text-slate-600 font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] py-4 px-6 rounded-2xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Continue to Subscription"
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-bold text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            Sign In
          </Link>
        </div>

        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          By signing up, you agree to our <Link to="#" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="#" className="text-blue-600 hover:underline">Privacy Policy</Link>.
        </p>
      </motion.div>

      <WarningModal
        isOpen={showCancelModal}
        onClose={closeCancelModal}
        onConfirm={confirmCancel}
        title="Discard Registration?"
        message="Are you sure you want to go back? All your filled information will be lost."
        confirmText="Yes, Discard"
        cancelText="Keep Editing"
        variant="danger"
      />
    </div>
  );
};

export default RegisterForm;
