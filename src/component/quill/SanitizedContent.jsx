import React from 'react';
import sanitizeHtml from 'sanitize-html';
import PropTypes from 'prop-types'
import parse from 'html-react-parser';

const SanitizedContent = ({ htmlContent, allowedTags, allowedAttributes }) => {
  const sanitizedHtml = sanitizeHtml(htmlContent, {
    allowedTags:allowedTags || sanitizeHtml.defaults.allowedTags.concat([]),
    allowedAttributes: allowedAttributes || sanitizeHtml.defaults.allowedAttributes,
  });

  return <>{parse(sanitizedHtml)}</>;
};

SanitizedContent.propTypes = {
  htmlContent: PropTypes.string, 
  allowedTags: PropTypes.arrayOf(PropTypes.string), 
  allowedAttributes: PropTypes.object, 
};

SanitizedContent.defaultProps = {
  allowedTags: sanitizeHtml.defaults.allowedTags, 
  allowedAttributes: sanitizeHtml.defaults.allowedAttributes,
};

export default SanitizedContent;