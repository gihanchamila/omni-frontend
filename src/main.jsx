import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './component/context/AuthContext.jsx'
import { SocketProvider } from './hooks/useSocket.jsx'
import { ProfileProvider } from './component/context/ProfileContext.jsx'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NotificationProvider } from './component/context/NotificationContext.jsx'

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
