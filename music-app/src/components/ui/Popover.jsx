// Popover.jsx
import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

const Popover = ({ trigger, children, className }) => {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  const togglePopover = () => setOpen(!open);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={togglePopover} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div
          className={cn(
            "absolute mt-2 p-3 bg-white shadow-lg border rounded-md z-50",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

Popover.propTypes = {
  trigger: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { Popover };
