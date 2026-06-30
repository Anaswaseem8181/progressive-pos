import { useState } from "react";
import { Store, Upload, X, Loader2 } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { notify } from "../../../utils/notifications";
import authService from "../../../api/authService";
import { updateBusinessInfoSuccess, removeLogoSuccess } from "../../../redux/slices/authSlice";
import { SettingsAccordion, SettingsField, SettingsInput, SettingsSaveButton } from "./SettingsComponents";
import { businessCategories } from "../../../data";

export const BusinessInfoSection = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const isAdmin = user?.role === "admin";

  const [form, setForm] = useState({
    businessName: user?.businessName || "",
    storeAddress: user?.storeAddress || "",
    contactNumber: user?.contactNumber || "",
    email: user?.adminEmail || user?.email || "",
    category: user?.businessCategory || "Clothing & Apparel",
  });
  
  const [logoPreview, setLogoPreview] = useState(user?.logoUrl || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return notify.error("Please select a valid image (JPG, PNG, WebP)");
    }
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return notify.error("Image size must be less than 2MB");
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = async () => {
    if (selectedFile) {
      // Just clear local selection if not yet uploaded
      setSelectedFile(null);
      setLogoPreview(user?.logoUrl || null);
      return;
    }
    
    if (user?.logoUrl) {
      setRemoving(true);
      try {
        await authService.removeLogo();
        dispatch(removeLogoSuccess());
        setLogoPreview(null);
        notify.success("Logo removed successfully");
      } catch (err) {
        notify.error(err.response?.data?.message || "Failed to remove logo");
      } finally {
        setRemoving(false);
      }
    }
  };

  const handleSave = async () => {
    if (!form.businessName || !form.contactNumber) {
      return notify.error("Business name and contact number are required");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("businessName", form.businessName);
      formData.append("category", form.category);
      formData.append("storeAddress", form.storeAddress);
      formData.append("contactNumber", form.contactNumber);
      
      if (selectedFile) {
        formData.append("logo", selectedFile);
      }

      const response = await authService.updateBusinessInfo(formData);
      
      if (response.success) {
        dispatch(updateBusinessInfoSuccess(response.data));
        setSelectedFile(null);
        notify.success("Business information saved!");
      }
    } catch (err) {
      notify.error(err.response?.data?.message || "Failed to update business info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsAccordion
      icon={Store}
      title="Store & Business Information"
      description="Update your store name, address, contact details, and logo."
      defaultOpen
      badge={!isAdmin && { text: "Read Only", color: "bg-gray-100 text-gray-500" }}
    >
      {!isAdmin && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-sm mb-4 border border-blue-100">
          Only administrators can modify business information.
        </div>
      )}
      
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
          {isAdmin && (
            <div className="flex flex-col gap-2">
              <label className={`cursor-pointer bg-emerald-50 text-emerald-600 font-bold text-xs px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-2 w-fit ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload size={14} />
                Upload Logo
                <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleLogoChange} disabled={loading} />
              </label>
              {logoPreview && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  disabled={removing || loading}
                  className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium disabled:opacity-50"
                >
                  {removing ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />} 
                  {removing ? 'Removing...' : 'Remove'}
                </button>
              )}
              <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
            </div>
          )}
        </div>
      </SettingsField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SettingsField label="Business Name">
          <SettingsInput 
            name="businessName" 
            value={form.businessName} 
            onChange={handleChange} 
            placeholder="e.g. My Clothing Store" 
            disabled={!isAdmin || loading}
          />
        </SettingsField>

        <SettingsField label="Business Category">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            disabled={!isAdmin || loading}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {businessCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </SettingsField>

        <SettingsField label="Store Address" hint="Optional">
          <SettingsInput 
            name="storeAddress" 
            value={form.storeAddress} 
            onChange={handleChange} 
            placeholder="e.g. 123 Main St, City" 
            disabled={!isAdmin || loading}
          />
        </SettingsField>

        <SettingsField label="Contact Number">
          <SettingsInput 
            name="contactNumber" 
            value={form.contactNumber} 
            onChange={handleChange} 
            placeholder="e.g. 0300-1234567" 
            disabled={!isAdmin || loading}
          />
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

      {isAdmin && (
        <SettingsSaveButton onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </SettingsSaveButton>
      )}
    </SettingsAccordion>
  );
};
