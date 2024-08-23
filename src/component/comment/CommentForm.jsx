import React from "react";
import PropTypes from "prop-types";
import Button from "../button/Button.jsx";
import addCommentValidator from "../../validators/addCommentValidator.js";

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
      <div className="py-4 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200">
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
      <Button
        type="submit"
        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 hover:bg-primary-800"
        disabled={isLoading}
      >
        {buttonText}
      </Button>
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
