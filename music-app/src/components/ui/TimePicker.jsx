// TimePicker.jsx
import PropTypes from "prop-types";

const TimePicker = ({ value, onChange }) => {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 focus:ring focus:ring-primary"
    />
  );
};

TimePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export { TimePicker };
