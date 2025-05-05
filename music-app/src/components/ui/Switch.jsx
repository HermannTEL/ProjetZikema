import { motion } from "framer-motion";

export const Switch = ({ checked, onCheckedChange }) => {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`relative w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        checked ? 'bg-green-500' : 'bg-gray-400'
      }`}
      aria-pressed={checked}
    >
      <motion.div
        className="w-4 h-4 bg-white rounded-full shadow-md"
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        style={{ x: checked ? 24 : 0 }}
      />
    </button>
  );
};
