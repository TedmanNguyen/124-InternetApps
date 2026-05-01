import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { StudentProvider } from './context/StudentContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StudentProvider>
        <App />
      </StudentProvider>
    </BrowserRouter>
  </StrictMode>,
)
