import React, { useState } from 'react';
import Button from '../button/Button.jsx';

const TwoFactorAuthentication = ({
  onEmailSubmit, // Callback function when email is submitted
  onCodeSubmit, // Callback function when code is submitted
  enableTwoFactor = false, // Default value for the checkbox state
  buttonText = 'Verify Email Address', // Default text for the button
  codeButtonText = 'Save Verification Settings', // Button text for code submission
}) => {
  const [step, setStep] = useState('email'); // 'email', 'verify', or 'success'
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(enableTwoFactor);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (onEmailSubmit) {
      onEmailSubmit(email); 
    }
    setStep('verify'); 
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    if (onCodeSubmit) {
      onCodeSubmit(verificationCode); 
    }
    // After successful verification, reset to the initial step and show the success message
    setStep('success');
    setEmail('');
    setVerificationCode('');
  };

  const handleReset = () => {
    setStep('email'); // Go back to the initial state
  };

  return (
    <div className="flex flex-col space-y-6 bg-white p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
      <p className="pb-10">
        {step === 'email' && (
          <>
            Two-Factor Authentication (2FA) enhances your account's security by requiring both your password and a unique code sent to your email. This extra layer of protection helps prevent unauthorized access, even if your password is compromised.
            
          </>
        )}
        {step === 'verify' && `A code has been successfully sent to your email address (${email}). Please enter the code below to complete the verification.`}
        {step === 'success' && 'Your email has been successfully verified! Two-Factor Authentication is now enabled.'}
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
                  className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                  placeholder="Enter verification email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant='info'>
                {buttonText}
              </Button>
            </>
          )}

          {step === 'verify' && (
            <>
              <div className="groupBox mb-12">
                <label htmlFor="verification-code" className="text-gray-700 font-medium">Enter 6-digit Code</label>
                <input
                  type="text"
                  name="verification-code"
                  id="verification-code"
                  className="input-box px-4 py-2 border rounded-lg focus:outline-none"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <Button className="mt-7" type="submit">
                {codeButtonText}
              </Button>
            </>
          )}

          {step === 'success' && (
            <Button className="mt-7 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600" onClick={handleReset}>
              Go Back to Two-Factor Authentication
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TwoFactorAuthentication;
