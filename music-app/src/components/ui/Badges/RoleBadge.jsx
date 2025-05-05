import PropTypes from "prop-types";

const RoleBadge = ({ role, isDark }) => {
  const roleColors = {
    student: isDark ? "bg-blue-900/40 text-blue-300 border-blue-700" : "bg-blue-50 text-blue-700 border-blue-200",
    professor: isDark ? "bg-purple-900/40 text-purple-300 border-purple-700" : "bg-purple-50 text-purple-700 border-purple-200",
    manager: isDark ? "bg-amber-900/40 text-amber-300 border-amber-700" : "bg-amber-50 text-amber-700 border-amber-200",
    admin: isDark ? "bg-red-900/40 text-red-300 border-red-700" : "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full capitalize border ${
      roleColors[role] || (isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700")
    }`}>
      {role}
    </span>
  );
};

RoleBadge.propTypes = {
  role: PropTypes.string.isRequired,
  isDark: PropTypes.bool.isRequired,
};

export {RoleBadge};
