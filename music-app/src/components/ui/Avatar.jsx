// Avatar.jsx
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

const Avatar = ({ src, alt, className, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <img
      src={src}
      alt={alt}
      className={cn("rounded-full object-cover", sizes[size], className)}
    />
  );
};

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export { Avatar };
