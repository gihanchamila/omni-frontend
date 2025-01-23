import { useState } from "react";

const Tooltip = ({ message, children, position = "top", show }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {(isVisible || show) && (
        <div
          className={`absolute ${getTooltipPosition(position)} bg-black text-white text-xs p-2 rounded-md shadow-md`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

// Function to handle tooltip position dynamically
const getTooltipPosition = (position) => {
  switch (position) {
    case "top":
      return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    case "bottom":
      return "top-full left-1/2 transform -translate-x-1/2 mt-2";
    case "left":
      return "right-full top-1/2 transform -translate-y-1/2 mr-2";
    case "right":
      return "left-full top-1/2 transform -translate-y-1/2 ml-2";
    default:
      return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
  }
};

export default Tooltip;
