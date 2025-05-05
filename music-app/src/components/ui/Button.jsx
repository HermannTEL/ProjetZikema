import React from "react";
import PropTypes from "prop-types";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { useTheme } from "../../utils/hooks";

const buttonVariants = (theme) => cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: theme === "dark" 
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-blue-500 text-white hover:bg-blue-600",
        destructive: theme === "dark"
          ? "bg-red-700 text-white hover:bg-red-800"
          : "bg-red-600 text-white hover:bg-red-700",
        outline: theme === "dark"
          ? "border border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-gray-100"
          : "border border-gray-300 hover:bg-gray-100 hover:text-gray-900",
        secondary: theme === "dark"
          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
          : "bg-gray-200 text-gray-900 hover:bg-gray-300",
        ghost: theme === "dark"
          ? "text-gray-200 hover:bg-gray-700 hover:text-gray-100"
          : "hover:bg-gray-100 hover:text-gray-900",
        link: theme === "dark"
          ? "underline-offset-4 hover:underline text-blue-400"
          : "underline-offset-4 hover:underline text-blue-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const { theme } = useTheme();
  const Comp = asChild ? "slot" : "button";
  
  return (
    <Comp
      className={cn(buttonVariants(theme)({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']),
  size: PropTypes.oneOf(['default', 'sm', 'lg', 'icon']),
  asChild: PropTypes.bool,
};

Button.defaultProps = {
  className: "",
  variant: "default",
  size: "default",
  asChild: false,
};

export { Button, buttonVariants };