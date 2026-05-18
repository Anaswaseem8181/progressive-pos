import { MoreVertical } from "lucide-react";
import { mergeClasses } from "../../utils/mergeClasses";

export const ActionDropdown = ({ isOpen, onToggle, actions, containerClassName = "" }) => {
  return (
    <div
      className={mergeClasses("text-left", containerClassName)}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onToggle}
        className={mergeClasses(
          "p-2 rounded-lg transition-colors",
          isOpen ? "bg-emerald-50 text-emerald-600" : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-50"
        )}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white ring-1 ring-black/5 z-[60] overflow-hidden transform origin-top-right transition-all">
          <div className="py-1 flex flex-col" role="menu">
            {actions.map((action, idx) => {
              const Icon = action.icon;
              const isDanger = action.variant === 'danger';
              const isInfo = action.variant === 'info';

              return (
                <button
                  key={idx}
                  onClick={() => {
                    action.onClick();
                    onToggle(); // auto close on click
                  }}
                  className={mergeClasses(
                    "text-left px-4 py-2.5 text-xs flex items-center gap-2.5 font-bold transition-colors",
                    isDanger
                      ? "text-red-600 hover:bg-red-50"
                      : isInfo
                        ? "text-blue-600 hover:bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                  )}
                  role="menuitem"
                >
                  <Icon size={14} />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
