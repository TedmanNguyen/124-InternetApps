import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { StudentProvider } from './context/StudentContext'
import { ReviewProvider } from './context/ReviewContext'
import { AdminProvider } from './context/AdminContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StudentProvider>
        <ReviewProvider>
          <AdminProvider>
            <App />
          </AdminProvider>
        </ReviewProvider>
      </StudentProvider>
    </BrowserRouter>
  </StrictMode>,
)
