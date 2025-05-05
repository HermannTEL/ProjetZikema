import React from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";
import { useTheme } from "../../utils/hooks";

const Card = React.forwardRef(({ className, role = "article", ...props }, ref) => {
  const { theme } = useTheme();
  
  return (
    <div
      ref={ref}
      role={role}
      className={cn(
        "rounded-lg border shadow-sm transition-colors",
        theme === "dark" 
          ? "bg-gray-800 text-gray-100 border-gray-700" 
          : "bg-white text-gray-900 border-gray-200",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";
Card.propTypes = {
  className: PropTypes.string,
  role: PropTypes.string
};

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";
CardHeader.propTypes = {
  className: PropTypes.string,
};

const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        theme === "dark" ? "text-white" : "text-gray-900",
        className
      )}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";
CardTitle.propTypes = {
  className: PropTypes.string,
};

const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme();
  
  return (
    <p
      ref={ref}
      className={cn(
        "text-sm",
        theme === "dark" ? "text-gray-400" : "text-gray-500",
        className
      )}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";
CardDescription.propTypes = {
  className: PropTypes.string,
};

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

CardContent.displayName = "CardContent";
CardContent.propTypes = {
  className: PropTypes.string,
};

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";
CardFooter.propTypes = {
  className: PropTypes.string,
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
