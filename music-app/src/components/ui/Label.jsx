// Label.jsx
import React from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";
import { useTheme } from "../../utils/hooks";
import { getThemeClass } from "../../utils/functions";

const Label = ({ htmlFor, children, className }) => {
  const { theme } = useTheme();

  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium mb-1 transition-colors",
        getThemeClass("text-gray-700", "text-gray-300", theme),
        className
      )}
    >
      {children}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { Label };
