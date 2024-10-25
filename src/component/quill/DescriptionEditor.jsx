import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DescriptionEditor = ({ formData, handleChange }) => {
  const quillRef = useRef(null);

  return (
    <div className="sm:col-span-2">
      <label htmlFor="description" className="label">
        Description
      </label>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={formData.description}
        onChange={(content, delta, source, editor) =>
          handleChange({
            target: {
              name: 'description',
              value: editor.getHTML(),
            },
          })
        }
        className="mt-2 mb-[04rem] sm:h-[25rem] leading-none"
        placeholder="Your description here"
        style={{ height: '47rem' }}  
        modules={{
          toolbar: [
            [{ header: '1' }, { header: '2' }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link'],
            ['clean'],
          ],
        }}
        formats={[
          'header',
          'bold',
          'italic',
          'underline',
          'strike',
          'blockquote',
          'code-block',
          'list',
          'bullet',
          'color',
          'background',
          'align',
          'link',
        ]}
      />
       <style>{`
        .ql-editor p {
          margin-bottom: 0; /* Reduce <p> tag margin */
        }

        .ql-editor li {
          list-style-type: disc !important; /* Ensure bullet points appear as dots */
          margin-left: 1.5rem; /* Adjust the indentation of the bullet points */
        }
      `}</style>
    </div>
  );
};

export default DescriptionEditor;
