import React from 'react';
import Select from 'react-select';

const Selector = ({ options, placeholder, value, onChange, error }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#D1D5DB', // Tailwind gray-300
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#3B82F6', // Tailwind blue-500
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF', // Tailwind gray-400
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 999, // Ensure menu is above other elements
    }),
  };

  return (
    <div className="w-full">
      <label className="label text-gray-700 font-semibold">
        Select a category
      </label>
      <Select
        id="category"
        options={options}
        styles={customStyles}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isClearable
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 font-semibold validateError">
          {error}
        </p>
      )}
    </div>
  );
};

export default Selector;
