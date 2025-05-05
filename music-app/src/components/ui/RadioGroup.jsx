// RadioGroup.jsx
import PropTypes from "prop-types";

const RadioGroup = ({ name, options, selected, onChange }) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
            className="accent-primary"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export { RadioGroup };
