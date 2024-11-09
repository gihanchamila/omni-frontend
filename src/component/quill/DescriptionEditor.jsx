import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  FaHeading,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaQuoteLeft,
  FaCode,
  FaListOl,
  FaListUl,
  FaPalette,
  FaTint,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaLink,
  FaEraser,
} from 'react-icons/fa';

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
        className="mt-2 mb-[04rem] sm:h-[25rem]"
        placeholder="Your description here"
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
        .ql-editor {
          font-family: var(--font-Inter), sans-serif;
          font-size: 16px;
          font-weight: 400;
          color: #334155;
          padding: 15px;
          height: 24rem;
        }

        /* Toolbar styling */
        .ql-toolbar {
          font-family: var(--font-Inter), sans-serif;
          font-size: 14px;
          font-weight: normal;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background-color: white;
          margin-bottom: 10px;
          box-shadow: none;
          margin-top: 10px;
        }

        .ql-toolbar button {
          font-size: 14px;
          padding: 8px;
        }

        /* Container styling with fixed height and scrolling */
        .ql-container {
          background-color: white;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          height: 24rem; /* Set constant height */
          overflow-y: auto; /* Enable vertical scrolling */
          box-shadow: none;
          padding-top: 10px; /* Add padding to avoid clipping the top */
        }

        /* Remove shadow */
        .ql-toolbar.ql-snow, .ql-container.ql-snow {
          box-shadow: none !important;
        }

        /* List styling */
        .ql-editor li {
          list-style-type: disc !important;
          margin-left: 1.5rem;
        }

        /* Placeholder text color */
        .ql-editor.ql-blank::before {
          color: #999;
        }

        .ql-container:focus {
          outline: none; /* Remove the default focus outline */
        }

        .ql-editor:focus {
          outline: none; /* Remove the default focus outline */
        }
      `}</style>
    </div>
  );
};

export default DescriptionEditor;
