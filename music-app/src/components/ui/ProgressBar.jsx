import PropTypes from "prop-types";
import { motion } from "framer-motion";

const getColorByPercent = (percent) => {
  if (percent < 40) return "bg-red-500 dark:bg-red-400";
  if (percent < 70) return "bg-yellow-500 dark:bg-yellow-400";
  return "bg-green-600 dark:bg-green-400";
};

const ProgressBar = ({ completed, height = 20, label = true }) => {
  const dynamicColor = getColorByPercent(completed);

  return (
    <div
      className="w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700"
      style={{ height }}
      aria-label="Barre de progression"
    >
      <motion.div
        className={`h-full flex items-center justify-end px-2 ${dynamicColor}`}
        initial={{ width: 0 }}
        animate={{ width: `${completed}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {label && (
          <span className="text-xs font-bold text-white dark:text-black">
            {completed}%
          </span>
        )}
      </motion.div>
    </div>
  );
};

ProgressBar.propTypes = {
  completed: PropTypes.number.isRequired,
  height: PropTypes.number,
  label: PropTypes.bool,
};

export { ProgressBar };
