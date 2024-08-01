import PropTypes from 'prop-types';
import { MdError } from 'react-icons/md';

const ErrorToast = ({ message }) => (
  <div className="flex items-center">
    <MdError className="text-red-500 text-2xl mr-2" />
    <span className="text-white">{message}</span>
  </div>
);

ErrorToast.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorToast;