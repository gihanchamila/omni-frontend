import { useState } from 'react';

const DropdownMenu = ({ dropdownId, actionHandlers }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const options = [
    { label: 'Edit', action: 'edit' },
    { label: 'Remove', action: 'delete' },
    { label: 'Report', action: 'report' },
  ];

  const handleOptionClick = (option) => {
    const actionHandler = actionHandlers[option.action];
    if (actionHandler) {
      actionHandler(dropdownId);
    } else {
      console.error(`No handler found for action: ${option.action}`);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        data-dropdown-toggle={`dropdown-${dropdownId}`}
        className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500"
        type="button"
        onClick={toggleDropdown}
      >
        <svg
          className="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 3"
        >
          <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
        </svg>
        <span className="sr-only">Comment settings</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 z-10 py-2 w-36 bg-white rounded-lg border-2 border-gray-100">
          <ul className="py-1 text-sm text-gray-700">
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                className="block py-1 px-4 hover:bg-gray-100 w-full text-left cursor-pointer"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
