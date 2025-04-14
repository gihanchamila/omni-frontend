import Button from "./Button";
import { useNavigate } from "react-router-dom";

const BackButton = ({ children, className, ...props }) => {
  const navigate = useNavigate();

  return (
    <button
      className={`flex items-center p-2  bg-gray-100 hover:bg-gray-200 rounded-full dark:bg-white gap-2 ${className}`}
      onClick={() => navigate(-1)}
      {...props}
    > 
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          className="dark:bg-slate-900"
          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 0 1 0 12h-3"
        />
      </svg>
      {children}
    </button>
  );
};

export default BackButton;