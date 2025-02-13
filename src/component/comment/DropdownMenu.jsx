import { useState, useEffect, useRef, forwardRef } from 'react';

const DropdownMenu = forwardRef(({ dropdownId, actionHandlers, currentUser, author, authorId }, ref) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  /* const authorOptions = [
    { label: 'Edit', action: 'edit', },
    { label: 'Remove', action: 'delete' },
    { label: 'Report', action: 'report' },
  ];

  const options = [
    { label: 'Report', action: 'report' },
  ] */

    const options = [
      { label: 'Edit', action: 'edit', },
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
    setDropdownOpen(false); // Close dropdown after an option is clicked
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left"
      onMouseLeave={handleMouseLeave}
    >
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

      {/* {dropdownOpen && (
        <div
          className="absolute right-0 z-10 py-2 w-36 bg-white rounded-lg border-2 border-gray-100"
          role="menu"
          aria-labelledby={`dropdown-${dropdownId}`}
        >
         <ul className="py-1 text-sm text-gray-700">
          {(currentUser === authorId ? authorOptions : options).map((option, i) => (
            <li
              key={i}
              role="menuitem"
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
        </div>
      )} */}

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
});

DropdownMenu.displayName = 'DropdownMenu';

export default DropdownMenu;
