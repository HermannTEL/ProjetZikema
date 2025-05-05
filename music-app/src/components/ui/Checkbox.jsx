// Checkbox.jsx
import PropTypes from "prop-types";

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-primary" />
      <span>{label}</span>
    </label>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export { Checkbox };
