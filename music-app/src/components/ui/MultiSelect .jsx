import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { useTheme } from "@/utils/hooks";
import { getThemeClass } from "@/utils/functions";

const MultiSelect = ({ options, selectedValues, onChange, placeholder, className, ...props }) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const toggleValue = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <div className={cn("relative mb-8", className)} {...props}>
      <button
        type="button"
        className={cn(
          "flex w-full justify-between items-center rounded-md border p-2 text-sm focus:outline-none",
          getThemeClass("bg-white text-black border-gray-300", "bg-zinc-800 text-white border-zinc-600", theme)
        )}
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">
          {selectedValues.length > 0
            ? selectedValues.map(val => options.find(opt => opt.value === val)?.label).join(", ")
            : placeholder}
        </span>
        <ChevronDown className={cn("ml-2 h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-10 mt-1 w-full rounded-md border shadow-lg bg-white dark:bg-zinc-900",
            getThemeClass("border-gray-300", "border-zinc-700", theme)
          )}
        >
          {options.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => toggleValue(value)}
              className={cn(
                "flex items-center justify-between w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-700",
                selectedValues.includes(value) ? "font-semibold" : ""
              )}
            >
              <div className="flex items-center space-x-2">
                {selectedValues.includes(value) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
                <span>{label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

MultiSelect.defaultProps = {
  selectedValues: [],
  onChange: () => {},
  placeholder: "Sélectionnez",
  className: "",
};

MultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  })).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.any),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export { MultiSelect };
