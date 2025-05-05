import React, {
  useState,
  Children,
  cloneElement,
  useRef,
  useEffect,
  forwardRef
} from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { useTheme } from "../../utils/hooks";
import { getThemeClass } from "../../utils/functions";

// Composant principal Select
const Select = forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const selectRef = useRef(null);
  const combinedRef = ref || selectRef;

  const handleItemClick = (itemValue) => {
    if (onValueChange) onValueChange(itemValue);
    setSelectedValue(itemValue);
    setIsOpen(false);
  };

  // Fermer le menu au clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (combinedRef.current && !combinedRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Synchronisation externe avec value
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  return (
    <div
      ref={combinedRef}
      className={cn("relative mb-4", className)}
      {...props}
    >
      <SelectTrigger
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        role="button"
      >
        <SelectValue>{selectedValue}</SelectValue>
        <ChevronDown
          className={cn("ml-2 transition-transform", isOpen && "rotate-180")}
        />
      </SelectTrigger>

      {isOpen && (
        <SelectContent role="listbox">
          {Children.map(children, (child) =>
            cloneElement(child, {
              onClick: () => handleItemClick(child.props.value),
              isSelected: child.props.value === selectedValue,
            })
          )}
        </SelectContent>
      )}
    </div>
  );
});
Select.displayName = "Select";
Select.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  value: PropTypes.string,
  onValueChange: PropTypes.func,
};

// SelectTrigger
const SelectTrigger = forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  return (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
        getThemeClass("bg-white text-black border-gray-300", "bg-zinc-800 text-white border-zinc-600", theme),
        className
      )}
      tabIndex={0}
      {...props}
    />
  );
});
SelectTrigger.displayName = "SelectTrigger";
SelectTrigger.propTypes = {
  className: PropTypes.string,
};

// SelectValue
const SelectValue = forwardRef(({ className, children, ...props }, ref) => {
  const { theme } = useTheme();
  return (
    <span
      ref={ref}
      className={cn(
        "truncate transition-colors",
        getThemeClass("text-gray-600", "text-gray-300", theme),
        className
      )}
      {...props}
    >
      {children || "Sélectionnez une option"}
    </span>
  );
});
SelectValue.displayName = "SelectValue";
SelectValue.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

// SelectContent
const SelectContent = forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-0 top-full z-10 mt-1 w-full rounded-md border shadow-md transition-colors",
        getThemeClass("bg-white border-gray-300", "bg-zinc-900 border-zinc-700", theme),
        className
      )}
      {...props}
    />
  );
});
SelectContent.displayName = "SelectContent";
SelectContent.propTypes = {
  className: PropTypes.string,
};

// SelectItem
const SelectItem = forwardRef(({ className, children, value, isSelected, onClick, ...props }, ref) => {
  const { theme } = useTheme();
  return (
    <div
      ref={ref}
      tabIndex={0}
      onClick={onClick}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "cursor-pointer px-3 py-2 text-sm transition-colors",
        getThemeClass("hover:bg-gray-100 text-black", "hover:bg-zinc-700 text-white", theme),
        isSelected && "font-semibold",
        className
      )}
      {...props}
    >
      {children || value}
    </div>
  );
});

SelectItem.displayName = "SelectItem";
SelectItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  value: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
};

// Export
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
};
