import React, { useState } from 'react'
import PropTypes from 'prop-types'
import axios from '../../utils/axiosInstance.js'
import { toast } from 'sonner';

const CommentSetting = ({ options, id, isReply, onClose, onClick }) => {
    
    return (
        <div id={id} className="z-10 absolute w-36 bg-white rounded-lg border-2 border-gray-100">
            <ul className="py-1 text-sm text-gray-700">
                {options.map((option, index) => (
                    <li key={index}>
                        <button
                            onClick={onClick}
                            className="block py-2 px-4 hover:bg-gray-100 w-full text-left"
                        >
                            {option.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

CommentSetting.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            onClick: PropTypes.func.isRequired,
            href: PropTypes.string,
        })
    ).isRequired,
    id: PropTypes.string.isRequired,
    isReply: PropTypes.bool,
    onClose: PropTypes.func,
};

export default CommentSetting;