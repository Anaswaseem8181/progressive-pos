import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { notify } from "../../../utils/notifications";
import { SettingsAccordion, SettingsField, SettingsSaveButton } from "./SettingsComponents";
import { mergeClasses } from "../../../utils/mergeClasses";

const PasswordInput = ({ label, name, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <SettingsField label={label}>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </SettingsField>
  );
};

export const SecuritySection = () => {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [strength, setStrength] = useState(0);

  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "newPass") setStrength(getStrength(value));
  };

  const handleSave = () => {
    if (!form.current || !form.newPass || !form.confirm) {
      notify.error("Please fill in all password fields.");
      return;
    }
    if (form.newPass !== form.confirm) {
      notify.error("New passwords do not match.");
      return;
    }
    if (strength < 2) {
      notify.error("Please choose a stronger password.");
      return;
    }
    notify.success("Password updated successfully!");
    setForm({ current: "", newPass: "", confirm: "" });
    setStrength(0);
  };

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-emerald-500"];

  return (
    <SettingsAccordion
      icon={ShieldCheck}
      title="Security"
      description="Update your account password and access controls."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PasswordInput label="Current Password" name="current" value={form.current} onChange={handleChange} placeholder="Enter current password" />
        <PasswordInput label="New Password" name="newPass" value={form.newPass} onChange={handleChange} placeholder="Enter new password" />
        <PasswordInput label="Confirm New Password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Confirm new password" />
      </div>

      {/* Password Strength Indicator */}
      {form.newPass.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={mergeClasses(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  strength >= s ? strengthColors[strength] : "bg-gray-200"
                )}
              />
            ))}
          </div>
          <p className="text-xs font-semibold" style={{ color: strength === 4 ? "#10b981" : strength === 3 ? "#3b82f6" : strength === 2 ? "#f59e0b" : "#f87171" }}>
            {strengthLabels[strength] || "Too weak"}
          </p>
        </div>
      )}

      <SettingsSaveButton label="Update Password" onClick={handleSave} />
    </SettingsAccordion>
  );
};
