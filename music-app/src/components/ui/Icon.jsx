// Icon.jsx
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";
import * as Unicons from "@iconscout/react-unicons"; // Utilisation de la bibliothèque préférée

const Icon = ({ name, size = 24, color = "currentColor", className }) => {
  const IconComponent = Unicons[name];

  if (!IconComponent) return null;

  return <IconComponent size={size} color={color} className={cn(className)} />;
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
};

export { Icon };
