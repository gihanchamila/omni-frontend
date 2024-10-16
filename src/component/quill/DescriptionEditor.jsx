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
        onChange={(content, delta, source, editor) => handleChange({
          target: {
            name: 'description',
            value: editor.getHTML(),
          },
        })}
        className="mt-2"
        placeholder="Your description here"
        modules={{
          toolbar: [
            [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
          ]
        }}
        formats={[
          'header', 'font',
          'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block',
          'list', 'bullet', 'color', 'background', 'align', 'link', 'image'
        ]}
      />
    </div>
  );
};

export default DescriptionEditor;