// Input.jsx
import React from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";
import { useTheme } from "../../utils/hooks";
import { getThemeClass } from "../../utils/functions";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  const { theme } = useTheme();

  return (
    <input
      ref={ref}
      type={type}
      value={props.value}
      onChange={props.onChange}
      className={cn(
        "w-full rounded-md border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
        getThemeClass("bg-white text-black border-gray-300", "bg-zinc-800 text-white border-zinc-600", theme),
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};

export { Input };
