import React, { useState } from 'react';
import axios from '../../utils/axiosInstance.js';
import { toast } from 'sonner';

const SearchBar = ({ currentPage, sortField, sortOrder, onSearchResults }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = async (e) => {
    const input = e.target.value;
    setSearchValue(input);

    if (!input.trim()) {
      onSearchResults({ categories: [], pages: 1 });
      return;
    }

    try {
      const response = await axios.get(`/category`, {
        params: {
          q: input,
          page: currentPage,
          sortField: sortField,
          sortOrder: sortOrder,
        },
      });

      const data = response.data.data;
      onSearchResults(data);
    } catch (error) {
      const response = error.response;
      const data = response?.data;
      toast.error(data?.message || "An error occurred while searching.");
    }
  };

  return (
    <form className="max-w-md mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block ps-10 text-sm border border-gray-300 opacity-80 hover:opacity-100 focus:opacity-100 rounded-full outline-none px-5 py-2 transition-opacity duration-200 ease-in-out"
          placeholder="Search categories"
          onChange={handleSearch}
          value={searchValue}
          required
        />
      </div>
    </form>
  );
};

export default SearchBar;
