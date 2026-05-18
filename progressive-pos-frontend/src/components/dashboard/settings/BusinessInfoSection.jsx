import { useState } from "react";
import { Store, Upload, X } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { notify } from "../../../utils/notifications";
import { SettingsAccordion, SettingsField, SettingsInput, SettingsSaveButton } from "./SettingsComponents";
import { businessCategory } from "../../../data";

export const BusinessInfoSection = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    businessName: user?.businessName || "",
    storeAddress: user?.storeAddress || "",
    contactNumber: user?.contactNumber || "",
    email: user?.email || "",
    category: user?.businessCategory || "Clothing & Apparel",
  });
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    notify.success("Business information saved!");
  };

  return (
    <SettingsAccordion
      icon={Store}
      title="Store & Business Information"
      description="Update your store name, address, contact details, and logo."
      defaultOpen
    >
      {/* Logo Upload */}
      <SettingsField label="Store Logo">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {logoPreview ? (
              <img src={logoPreview} alt="Store Logo" className="w-full h-full object-cover" />
            ) : (
              <Upload size={20} className="text-gray-400" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer bg-emerald-50 text-emerald-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-2 w-fit">
              <Upload size={14} />
              Upload Logo
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </label>
            {logoPreview && (
              <button
                type="button"
                onClick={() => setLogoPreview(null)}
                className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
              >
                <X size={12} /> Remove
              </button>
            )}
            <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </SettingsField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SettingsField label="Business Name">
          <SettingsInput name="businessName" value={form.businessName} onChange={handleChange} placeholder="e.g. My Clothing Store" />
        </SettingsField>

        <SettingsField label="Business Category">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            {businessCategory.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </SettingsField>

        <SettingsField label="Store Address" hint="As entered during registration">
          <SettingsInput name="storeAddress" value={form.storeAddress} onChange={handleChange} placeholder="e.g. 123 Main St, City" />
        </SettingsField>

        <SettingsField label="Contact Number" hint="As entered during registration">
          <SettingsInput name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="e.g. +92 300 1234567" />
        </SettingsField>

        <SettingsField label="Email Address" hint="Registered account email — contact support to change">
          <input
            type="email"
            value={form.email}
            disabled
            className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
          />
        </SettingsField>
      </div>

      <SettingsSaveButton onClick={handleSave} />
    </SettingsAccordion>
  );
};
