import React from "react";
import PropTypes from "prop-types";
import Button from "../button/Button.jsx";
import addCommentValidator from "../../validators/addCommentValidator.js";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

const CommentForm = ({
  handleSubmit,
  handleChange,
  formData,
  formError,
  isLoading,
  placeholder,
  buttonText,
  className,
}) => {
  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="lg:py-4 lg:px-4 sm:mb-4 bg-white rounded-lg rounded-t-lg border sm:p-4 lg:p-0 border-gray-200">
        <label htmlFor="comment" className="sr-only">
          {placeholder}
        </label>
        <textarea
          id="comment"
          rows="4"
          className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
          placeholder={placeholder}
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        ></textarea>
        {formError && (
          <p className="text-red-500 text-xs italic">{formError.content}</p>
        )}
      </div>
      <MotionButton
        initial={{opacity : 0, scale : 0.5}}
        animate={{opacity : 1, scale : 1}}
        transition={{delay : 0.5, duration : 0.5}}
        variant='primary'
        type="submit"
        className="mt-2"
        disabled={isLoading}
      >
        {buttonText}
      </MotionButton>
    </form>
  );
};

CommentForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  formError: PropTypes.object,
  isLoading: PropTypes.bool,
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string,
};

CommentForm.defaultProps = {
  formError: null,
  isLoading: false,
  placeholder: "Write a comment...",
  buttonText: "Post comment",
  className: "mb-6",
};

export default CommentForm;
