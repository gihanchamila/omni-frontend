import React from 'react';

const Pagination = ({ currentPage, totalPage, pageCount, onPageChange }) => {
  
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPage) onPageChange(currentPage + 1);
  };

  return (
    pageCount.length > 0 && (
      <nav className="flex items-center justify-center pb-10 mt-5" aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px text-sm">
          <li>
            <button
              className="pageButton rounded-l-lg rounded-r-none"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>
          {pageCount.map((pageNumber, index) => (
            <li key={index}>
              <button
                className={`pageButton rounded-none ${currentPage === pageNumber ? 'bg-gray-100 active:bg-gray-200' : ''}`}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          ))}
          <li>
            <button
              className="pageButton rounded-r-lg rounded-l-none"
              onClick={handleNext}
              disabled={currentPage === totalPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    )
  );
};

export default Pagination;
