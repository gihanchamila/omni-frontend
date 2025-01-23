import { useState, useRef } from "react";
import { motion } from "framer-motion";

const AnimatedButton = ({children, ...props}) => {
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
        Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
      );

      // Adjust the threshold distance to trigger the animation
      if (distance < 200) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      {...props}
      className="flex justify-center items-center"
    >
      <motion.button
        ref={buttonRef}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
        animate={hovered ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {children}
      </motion.button>
    </div>
  );
};

export default AnimatedButton;
