import { motion } from "motion/react";
import { BusinessInfoSection } from "../../components/dashboard/settings/BusinessInfoSection";
import { AppearanceSection } from "../../components/dashboard/settings/AppearanceSection";
import { SecuritySection } from "../../components/dashboard/settings/SecuritySection";
import { TaxDiscountSection } from "../../components/dashboard/settings/TaxDiscountSection";

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-3xl"
    >
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 text-sm">Manage your store preferences, appearance, and security.</p>
      </div>

      <BusinessInfoSection />
      <AppearanceSection />
      <SecuritySection />
      <TaxDiscountSection />
    </motion.div>
  );
};

export default Settings;
