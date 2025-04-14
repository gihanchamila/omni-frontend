import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Button = forwardRef(
  ({ className = "", variant, primary, children, to, onClick, disabled, ...props }, ref) => {
    const finalVariant = primary ? "primary" : variant;

    const baseClasses =
      "transition-colors duration-100 lg:font-medium lg:rounded-lg lg:text-sm lg:px-2 lg:py-2 sm:px-2 sm:py-2.5 xs:py-2 xs:px-2 xs:rounded-md sm:rounded-md sm:text-xs xs:text-xs focus:outline-none tracking-wider";

    // Variant-based classes
    const variantClasses = {
      primary: "bg-slate-900 text-white hover:bg-slate-600 focus:bg-slate-800 dark:bg-gray-100 dark:text-slate-800 dark:hover:bg-white dark:hover-text-slate-500",
      error: "bg-red-500 text-white hover:bg-red-600",
      success: "bg-green-500 text-white hover:bg-green-500",
      info: "bg-blue-500 text-white hover:bg-blue-600",
      back: "bg-gray-300 rounded-full",
      outline: "border border-gray-200 hover:bg-gray-50 text-gray-800 dark:sm:text-slate-700 dark:lg:text-slate-700",
    };

    // Custom disabled color
    const disabledClasses = "bg-gray-100 text-gray-500 cursor-not-allowed pointer-events-none";

    // Combine classes, with condition for disabled state
    const classes = `${baseClasses} ${
      disabled ? disabledClasses : variantClasses[finalVariant] || ""
    } ${className}`;

    const spanClasses = "relative z-10";

    const renderButton = () => (
      <motion.button
        ref={ref}
        className={classes}
        onClick={onClick}
        {...props}
        disabled={disabled}
        whileTap={{ scale: 0.95 }}
      >
        <span className={spanClasses}>{children}</span>
      </motion.button>
    );

    const renderLink = () => (
      <Link ref={ref} to={to} className={classes} {...props}>
        <span className={spanClasses}>{children}</span>
      </Link>
    );

    return to ? renderLink() : renderButton();
  }
);

Button.displayName = "Button";

export default Button;
