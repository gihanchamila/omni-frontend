import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './component/context/AuthContext.jsx'
import { SocketProvider } from './component/context/useSocket.jsx'
import { ProfileProvider } from './component/context/ProfileContext.jsx'
import { NotificationProvider } from './component/context/NotificationContext.jsx'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ProfileProvider>
            <NotificationProvider>
              <React.StrictMode>
                <App />
              </React.StrictMode>
            </NotificationProvider>
          </ProfileProvider> 
        </SocketProvider>
      </AuthProvider> 
    </BrowserRouter>
)
