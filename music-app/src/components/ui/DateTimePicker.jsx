// DateTimePicker.jsx
import PropTypes from "prop-types";

const DateTimePicker = ({ value, onChange }) => {
  return (
    <input
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 focus:ring focus:ring-primary"
    />
  );
};

DateTimePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export { DateTimePicker };
