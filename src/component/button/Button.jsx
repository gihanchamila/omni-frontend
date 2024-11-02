import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Button = ({type, children, variant, className, to, onClick, ...props }) => {
  const baseClasses = "transition-colors duration-100 font-medium rounded-lg text-sm px-2 py-2 focus:outline-none tracking-wider";

  // Variant-based classes
  const variantClasses = {
    primary: "bg-slate-800 text-white hover:bg-slate-600",
    error: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-500",
    info: "bg-blue-500 text-white hover:bg-blue-600 ",
    back : "bg-gray-300 rounded-full",
    outline : "border border-gray-200 hover:bg-gray-50 text-gray-800 "
  };

  const classes = `${baseClasses} ${className} ${variantClasses[variant]}}`;
  const spanClasses = "relative z-10";

  const renderButton = () => (
    <button className={`${classes} ${className}`} onClick={onClick} {...props}>
      <span className={spanClasses}>{children}</span>
    </button>
  );

  const renderLink = () => (
    <Link to={to} className={`${classes} ${className}`} {...props}>
      <span className={spanClasses}>{children}</span>
    </Link>
  );

  return to ? renderLink() : renderButton();
};

export default Button;