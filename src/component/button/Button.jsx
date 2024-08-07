import { Link } from "react-router-dom";
import PropTypes from "prop-types"

const Button =({children, primary, className, to, onClick, ...props }) => {

    const classes = `button hover:bg-slate-700 transition-colors duration-100 ${className || ""} ${primary ? "" : "bg-slate-800 text-white"}`
    const spanClasses = "relative z-10";

    const renderButton = () => (
        <button className={classes} onClick={onClick} {...props}>
          <span className={spanClasses}>{children}</span>
        </button>
      );
    
    const renderLink = () => (
        <Link to={to} className={classes} {...props}>
            <span className={spanClasses}>{children}</span>
        </Link>
    );

    return to ? renderLink() : renderButton();
}

export default Button