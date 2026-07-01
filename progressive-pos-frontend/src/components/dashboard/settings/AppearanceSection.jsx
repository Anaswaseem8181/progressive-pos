import { useState } from "react";
import { Palette, Monitor, Sun, Moon, Check } from "lucide-react";
import { notify } from "../../../utils/notifications";
import { SettingsAccordion, SettingsSaveButton } from "./SettingsComponents";
import { mergeClasses } from "../../../utils/mergeClasses";
import { themes } from "../../../data";


export const AppearanceSection = () => {
  const [selectedTheme, setSelectedTheme] = useState("system");

  const handleSave = () => {
    notify.success(`Appearance set to "${themes.find(t => t.id === selectedTheme)?.label}"!`);
  };

  return (
    <SettingsAccordion
      icon={Palette}
      title="Appearance"
      description="Customize how the dashboard looks on your device."
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {themes.map(({ id, label, icon: Icon, description }) => {
          const isSelected = selectedTheme === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedTheme(id)}
              className={mergeClasses(
                "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer",
                isSelected
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check size={11} className="text-white" />
                </div>
              )}
              <Icon size={24} />
              <span className="font-bold text-sm">{label}</span>
              <span className="text-xs font-normal text-gray-400 text-center">{description}</span>
            </button>
          );
        })}
      </div>

      <SettingsSaveButton onClick={handleSave} />
    </SettingsAccordion>
  );
};
