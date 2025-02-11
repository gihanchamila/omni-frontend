import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Button = forwardRef(({ className = "", variant, primary, children, to, onClick, ...props }, ref) => {
  const finalVariant = primary ? "primary" : variant;

  const baseClasses =
    "transition-colors duration-100 lg:font-medium lg:rounded-lg lg:text-sm lg:px-2 lg:py-2 sm:px-2 sm:py-2 sm:rounded-md sm:text-xs focus:outline-none tracking-wider";

  // Variant-based classes
  const variantClasses = {
    primary: "bg-slate-900 text-white hover:bg-slate-600 focus:bg-slate-900",
    error: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-500",
    info: "bg-blue-500 text-white hover:bg-blue-600",
    back: "bg-gray-300 rounded-full",
    outline: "border border-gray-200 hover:bg-gray-50 text-gray-800",
  };

  const classes = `${baseClasses} ${variantClasses[finalVariant] || ""} ${className}`;  // className prop is applied here
  const spanClasses = "relative z-10";

  const renderButton = () => (
    <motion.button ref={ref} className={classes} onClick={onClick} {...props} whileTap={{ scale: 0.95 }}>
      <span className={spanClasses}>{children}</span>
    </motion.button>
  );

  const renderLink = () => (
    <Link ref={ref} to={to} className={classes} {...props}>
      <span className={spanClasses}>{children}</span>
    </Link>
  );

  return to ? renderLink() : renderButton();
});

Button.displayName = "Button";

export default Button;
