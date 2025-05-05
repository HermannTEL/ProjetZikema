import React, { useState, useEffect, Children, cloneElement } from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

const Tabs = React.forwardRef(({ defaultValue, value, onValueChange, className, children }, ref) => {
  const [activeValue, setActiveValue] = useState(value ?? defaultValue);

  useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value);
    }
  }, [value]);

  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setActiveValue(newValue);
    }
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  // Process children recursively to find and modify TabsTriggers
  const processChildren = (children) => {
    return Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      
      // Handle TabsTrigger components
      if (child.type?.displayName === "TabsTrigger") {
        return cloneElement(child, {
          active: child.props.value === activeValue,
          onClick: () => handleTabChange(child.props.value),
        });
      }
      
      // Handle TabsContent components
      if (child.type?.displayName === "TabsContent") {
        return child.props.value === activeValue ? child : null;
      }
      
      // Recursively process children of other components (like TabsList)
      if (child.props.children) {
        return cloneElement(child, {
          children: processChildren(child.props.children)
        });
      }
      
      return child;
    });
  };

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {processChildren(children)}
    </div>
  );
});
Tabs.displayName = "Tabs";

Tabs.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onValueChange: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

TabsList.propTypes = {
  className: PropTypes.string,
};

const TabsTrigger = React.forwardRef(({ className, active, value, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
        active && "bg-background text-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
});

TabsTrigger.displayName = "TabsTrigger";

TabsTrigger.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

const TabsContent = React.forwardRef(({ className, value, ...props }, ref) => (
  <div
    ref={ref}
    role="tabpanel"
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

TabsContent.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export { Tabs, TabsList, TabsTrigger, TabsContent };