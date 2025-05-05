// Dropdown.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

const Dropdown = ({ trigger, items, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div className={cn("absolute mt-2 w-48 bg-white shadow-lg rounded-md", className)}>
          {items.map((item, index) => (
            <button
              key={index}
              className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
              onClick={item.onClick}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  trigger: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

export { Dropdown };
