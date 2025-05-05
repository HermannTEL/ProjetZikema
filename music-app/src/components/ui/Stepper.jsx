// Stepper.jsx
// import { useState } from "react";
import PropTypes from "prop-types";

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex space-x-4">
      {steps.map((step, index) => (
        <div key={index} className={`px-4 py-2 rounded ${currentStep === index ? "bg-primary text-white" : "bg-gray-200"}`}>
          {step.label}
        </div>
      ))}
    </div>
  );
};

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired })).isRequired,
  currentStep: PropTypes.number.isRequired,
};

export { Stepper };
