// DatePicker.jsx
import PropTypes from "prop-types";

const DatePicker = ({ value, onChange }) => {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 focus:ring focus:ring-primary"
    />
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export { DatePicker };
