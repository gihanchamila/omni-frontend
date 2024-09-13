import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './component/context/AuthContext.jsx'
import { SocketProvider } from './hooks/useSocket.jsx'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </SocketProvider>
      </AuthProvider> 
    </BrowserRouter>
)
