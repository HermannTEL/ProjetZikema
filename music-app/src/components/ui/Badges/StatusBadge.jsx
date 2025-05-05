import { CheckCircle, XCircle } from "lucide-react";
import PropTypes from "prop-types";

const StatusBadge = ({ isActive, isDark }) => (
  <span className={`text-xs px-3 py-1 rounded-full inline-flex items-center gap-1 ${
    isActive
      ? isDark ? "bg-green-900/50 text-green-300 border border-green-700"
              : "bg-green-100 text-green-700 border border-green-200"
      : isDark ? "bg-red-900/50 text-red-300 border border-red-700"
              : "bg-red-100 text-red-700 border-red-200"
  }`}>
    {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
    {isActive ? "Actif" : "Inactif"}
  </span>
);

StatusBadge.propTypes = {
  isActive: PropTypes.bool.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export {StatusBadge};
