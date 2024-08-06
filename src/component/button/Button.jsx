import { Link } from "react-router-dom";

const Button =({children, primary, className, to, onClick}) => {

    const classes = `button ${className || ""} ${primary ? "" : "bg-color-s text-white"}`
    const spanClasses = "relative z-10";

    const renderButton = () => (
        <button className={classes} onClick={onClick}>
          <span className={spanClasses}>{children}</span>
        </button>
      );
    
    const renderLink = () => (
        <Link to={to} className={classes}>
            <span className={spanClasses}>{children}</span>
        </Link>
    );

    return to ? renderLink() : renderButton();
}

export default Button