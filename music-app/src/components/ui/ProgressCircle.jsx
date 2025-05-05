import PropTypes from "prop-types";
import { motion } from "framer-motion";

const getColorByPercent = (percent) => {
  if (percent < 40) return "text-red-500 stroke-red-400";
  if (percent < 70) return "text-yellow-500 stroke-yellow-400";
  return "text-green-600 stroke-green-400";
};

const ProgressCircle = ({ completed, size = 100, label = true }) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completed / 100) * circumference;

  const colorClass = getColorByPercent(completed);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={colorClass}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1 }}
          strokeLinecap="round"
        />
      </svg>
      {label && (
        <span className={`absolute text-sm font-semibold ${getColorByPercent(completed).split(" ")[0]}`}>
          {completed}%
        </span>
      )}
    </div>
  );
};

ProgressCircle.propTypes = {
  completed: PropTypes.number.isRequired,
  size: PropTypes.number,
  label: PropTypes.bool,
};

export { ProgressCircle };
