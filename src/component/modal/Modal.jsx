import React from 'react';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Modal = ({ showModal, title, children, onConfirm, onCancel }) => {
  const modalRef = useRef(null)
  const lastFocusedElement = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
  
    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal, onCancel]);

  useEffect(() => {
    if (showModal) {
      lastFocusedElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'auto';
      lastFocusedElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'auto';
      lastFocusedElement.current?.focus();
    };
  }, [showModal]);

  if (!showModal) return null;

  return (
    <motion.div
      
      aria-labelledby="modal-title"
      aria-modal="true"
      id="popup-modal"
      tabIndex="-1"
      className="m-0 mt-0 fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full backdrop-brightness-50  overflow-hidden min-h-screen"
    >
      <div ref={modalRef} className="relative p-4 w-full max-w-md">
        <motion.div 
          className="relative bg-white sm:m-5  rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center overflow-hidden"
            onClick={onCancel}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">
            <h3 className="mb-5 mt-10 font-normal text-gray-500 text-md">
              {title}
            </h3>
            {children}
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                onClick={onConfirm}
              >
                Yes, I'm sure
              </button>
              <button
                type="button"
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
                onClick={onCancel}
              >
                No, cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Modal;