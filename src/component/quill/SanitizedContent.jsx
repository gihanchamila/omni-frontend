import React, { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';
import parse from 'html-react-parser';

const SanitizedContent = ({ htmlContent, allowedTags, allowedAttributes }) => {
  const sanitizedHtml = useMemo(() => {
    try {
      return sanitizeHtml(htmlContent, {
        allowedTags: allowedTags || sanitizeHtml.defaults.allowedTags.concat([]),
        allowedAttributes: allowedAttributes || sanitizeHtml.defaults.allowedAttributes,
      });
    } catch (error) {
      console.error('Sanitization failed:', error);
      return '';
    }
  }, [htmlContent, allowedTags, allowedAttributes]);

  return <>{parse(sanitizedHtml)}</>;
};

export default React.memo(SanitizedContent);
