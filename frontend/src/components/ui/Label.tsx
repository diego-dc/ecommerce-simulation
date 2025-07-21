import React from "react";

interface LabelProps {
  htmlFor: string;
  text: string;
  tooltipMessage?: string; // New prop for tooltip
}

const Label: React.FC<LabelProps> = ({ htmlFor, text, tooltipMessage }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center mb-2 text-sm font-bold"
    >
      {text}
      {tooltipMessage && (
        <span
          className="ml-2 text-gray-400 cursor-help" // Basic styling for the icon
          title={tooltipMessage} // Native tooltip for simplicity
        >
          {/* You can replace this with an actual icon component */}
          ℹ️
        </span>
      )}
    </label>
  );
};

export default Label;
