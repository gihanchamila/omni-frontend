import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './component/context/AuthContext.jsx'
import { SocketProvider } from './hooks/useSocket.jsx'
import { ProfileProvider } from './component/context/ProfileContext.jsx'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ProfileProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </ProfileProvider> 
        </SocketProvider>
      </AuthProvider> 
    </BrowserRouter>
)
