import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

const Loader = ({ size = "md", color = "gray", className, speed = "normal", ariaLabel = "Loading..." }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-4",
    lg: "w-8 h-8 border-4",
    xl: "w-10 h-10 border-4",
    xl2: "w-12 h-12 border-4",
    xl3: "w-16 h-16 border-4",
  };

  const speedClasses = {
    slow: "animate-spin-slow",
    normal: "animate-spin",
    fast: "animate-spin-fast",
  };

  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div
          role="status"
          aria-label={ariaLabel}
          className={cn(
            "rounded-full border-t-2",
            sizes[size],
            `border-b-2 border-${color}-500 mx-auto`,
            speedClasses[speed],
            className
          )}
        />
        <p className="mt-4">Chargement du profil...</p>
      </div>
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  color: PropTypes.string, // Accept any valid Tailwind color
  className: PropTypes.string,
  speed: PropTypes.oneOf(["slow", "normal", "fast"]),
  ariaLabel: PropTypes.string,
};

export { Loader };