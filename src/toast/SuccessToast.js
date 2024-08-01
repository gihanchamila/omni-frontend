import PropTypes from 'prop-types';
import { MdCheckCircle } from 'react-icons/md';

const SuccessToast = ({ message }) => (
  <div className="flex items-center">
    <MdCheckCircle className="text-green-500 text-2xl mr-2" />
    <span className="text-white">{message}</span>
  </div>
);

SuccessToast.propTypes = {
    message: PropTypes.string.isRequired,
  };

export default SuccessToast;