import { Link } from "react-router-dom";
import { forwardRef } from "react";
import PropTypes from "prop-types";

const Button = forwardRef(({ className = "", variant, children, to, onClick, ...props }, ref) => {
  const baseClasses =
    "transition-colors duration-100 lg:font-medium lg:rounded-lg lg:text-sm lg:px-2 lg:py-2 sm:px-2 sm:py-1 sm:rounded-md sm:text-xs focus:outline-none tracking-wider";

  // Variant-based classes
  const variantClasses = {
    primary: "bg-slate-900 text-white hover:bg-slate-600 focus:bg-slate-600",
    error: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-500",
    info: "bg-blue-500 text-white hover:bg-blue-600",
    back: "bg-gray-300 rounded-full",
    outline: "border border-gray-200 hover:bg-gray-50 text-gray-800",
  };

  const classes = `${baseClasses} ${variantClasses[variant] || ""} ${className}`;
  const spanClasses = "relative z-10";

  const renderButton = () => (
    <button ref={ref} className={classes} onClick={onClick} {...props}>
      <span className={spanClasses}>{children}</span>
    </button>
  );

  const renderLink = () => (
    <Link ref={ref} to={to} className={classes} {...props}>
      <span className={spanClasses}>{children}</span>
    </Link>
  );

  return to ? renderLink() : renderButton();
});

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["primary", "error", "success", "info", "back", "outline"]),
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  onClick: PropTypes.func,
};

Button.displayName = "ButtonComponent";

export default Button;
