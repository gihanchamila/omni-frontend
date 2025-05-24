import React, { useState, useEffect } from 'react';
import Button from '../button/Button.jsx';
import axios from '../../utils/axiosInstance.js';
// import { toast } from 'sonner';
import Modal from '../modal/Modal.jsx';

const TwoFactorAuthentication = ({
  onEmailSubmit,
  onCodeSubmit,
  enableTwoFactor = false,
  buttonText = 'Verify Email Address',
  codeButtonText = 'Save Verification Settings',
}) => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(enableTwoFactor);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const getVerificationStatus = async () => {
      try {
        const response = await axios.get('/auth/verification-status');
        const data = response.data
        // toast.success(data.message)
        setIsVerified(response.data.isVerified);
        setStep(response.data.isVerified ? 'success' : 'email');
      } catch (error) {
        const response = error.response
        const data = response.data.data
        // toast.error(data.message)
      }
    };

    getVerificationStatus();
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (onEmailSubmit) {
      setLoading(true);
      try {
        await onEmailSubmit(email);
        setStep('verify');
      } catch (error) {
        // toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (onCodeSubmit) {
      setLoading(true);
      try {
        await onCodeSubmit(email, verificationCode);
        setIsVerified(true); // Mark as verified
        setStep('success');
        setEmail('');
        setVerificationCode('');
      } catch (error) {
        // toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = async () => {
    try{
      const response = await axios.put("/auth/update-verification-status")
      const data = response.data
      // toast.success(data.message)
    }catch(error){
      const response = error.response
      const data = response.data
      // toast.error(data.message)
    }
    setStep('email');
    setIsVerified(false); 
  };

  return (
    <div className="flex flex-col space-y-6 lg:bg-white sm:bg-gray-50 sm:p-6 xs:p-0 rounded-lg">
      <h4 className="settingsubTitle">Two-Factor Authentication</h4>
      <p className="pb-4 dark:text-gray-700">
        {step === 'email' && (
          <p className='dark:sm:text-gray-700 pb-8'>
            Two-Factor Authentication (2FA) enhances your account's security by requiring both your password and a unique code sent to your email. This extra layer of protection helps prevent unauthorized access, even if your password is compromised.
          </p>
        )}
        {step === 'verify' && `A code has been successfully sent to your email address (${email}). Please enter the code below to complete the verification.`}
        {step === 'success' && (
          <>
          <div className='pb-6'>
          <p className='twofactorbodyText'>Your account is protected with 2-Step Verification.</p><br/>
          <p className='twofactorbodyText'>Prevent hackers from accessing your account with an additional layer of security.</p><br/>
          <p className='twofactorbodyText'>Unless you’re signing in with a passkey, you’ll be asked to complete the most secure second step available on your account.</p>
          </div>
            
          </>
        )}
      </p>
      <form onSubmit={step === 'email' ? handleEmailSubmit : handleVerificationSubmit}>
        <div className="flex flex-col space-y-6">
          {step === 'email' && (
            <>
              <div className="groupBox">
                <label htmlFor="verify-email" className="text-gray-700 font-medium">Verify Email Address</label>
                <input
                  type="email"
                  name="verify-email"
                  id="verify-email"
                  className="input-box px-4 py-2 pb-3 border rounded-lg focus:outline-none"
                  placeholder="Enter verification email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button className={'sm:py-2 sm:text-sm'} type="submit" variant='info' disabled={loading}>
                {loading ? 'Sending...' : buttonText}
              </Button>
            </>
          )}

          {step === 'verify' && (
            <>
              <div className="flex flex-col space-y-4 justify-between lg:pb-16">
                <label htmlFor="verification-code" className="text-gray-700 font-medium">Enter 6-digit Code</label>
                <input
                  type="text"
                  name="verificationCode"
                  id="verification-code"
                  className="input-box px-4 py-2 pb-3 border rounded-lg focus:outline-none "
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 6) {
                      setVerificationCode(value);
                    }
                  }}
                  required
                />
              </div>
              <Button variant='info' type="submit" className={"mt-5"} disabled={loading}>
                {loading ? 'Verifying...' : codeButtonText}
              </Button>
            </>
          )}

          {step === 'success' && isVerified && (
            <Button className={'mt-6 sm:py-2 sm:text-sm'} variant="info" onClick={() => setShowModal(true)}>
              Update 2-step verification email
            </Button>
          )}
        </div>
      </form>
      <Modal 
        showModal={showModal} 
        title="Confirm Update" 
        onConfirm={() => {
          handleReset();
          setShowModal(false);
        }} 
        onCancel={() => setShowModal(false)}
      >
        <p className='dark:text-gray-700'>Are you sure you want to update your 2-step verification email?</p>
      </Modal>
    </div>
  );
};

export default TwoFactorAuthentication;

