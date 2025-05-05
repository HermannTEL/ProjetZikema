// Separator.jsx
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";
import { useTheme } from "../../utils/hooks";
import { getThemeClass } from "../../utils/functions";

const Separator = ({ className, orientation = "horizontal", ...props }) => {
  const {theme } = useTheme();
  const separatorClass = getThemeClass("bg-gray-300", "bg-zinc-700", theme);

  return (
    <div
      className={cn(
        `${separatorClass} ${orientation === "horizontal" ? "h-px w-full my-10" : "w-px h-full mx-10"}`,
        className
      )}
      {...props}
    />
  );
};

Separator.propTypes = {
  className: PropTypes.string,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
};

export { Separator };
