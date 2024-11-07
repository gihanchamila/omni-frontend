import React, { useState } from 'react'
import Button from '../component/button/Button.jsx'

const ForgotPassword = () => {

  const [email, setEmail] = useState("")

  return (
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
    <Button type="submit" variant='info' >
      Verify
    </Button>
  </>
  )
}

export default ForgotPassword