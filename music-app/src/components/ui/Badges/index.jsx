import React from "react";
import PropTypes from "prop-types";
import { cva } from "class-variance-authority";
import { cn } from "../../../lib/utils";
import { useTheme } from "../../../utils/hooks";


const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
        primary: "bg-blue-500 text-white dark:bg-blue-600 dark:text-white",
        secondary: "bg-green-500 text-white dark:bg-green-600 dark:text-white",
        success: "bg-green-500 text-white dark:bg-green-600 dark:text-white",
        destructive: "bg-red-500 text-white dark:bg-red-600 dark:text-white",
        outline: "border border-gray-300 text-gray-800 dark:border-gray-600 dark:text-gray-200",
      },
      size: {
        default: "px-2 py-1",
        sm: "px-1 py-0.5 text-xs",
        lg: "px-3 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Badge = React.forwardRef(({ className, variant, size, children, ...props }, ref) => {
  const { theme } = useTheme(); 
  
  // You can use the theme variable to conditionally apply additional classes if needed
  // This is useful for complex theme-specific styling that can't be handled by dark: classes
  const themeSpecificClass = theme === 'dark' ? 'dark-theme-badge' : 'light-theme-badge';
  
  return (
    <span
      className={cn(badgeVariants({ variant, size }), themeSpecificClass, className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

// PropTypes validation
Badge.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'destructive', 'outline']),
  size: PropTypes.oneOf(['default', 'sm', 'lg']),
  children: PropTypes.node.isRequired,
};

// Default props
Badge.defaultProps = {
  className: "",
  variant: "default",
  size: "default",
};

export { Badge, badgeVariants };