import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import './index.css'
import i18n from './i18n.js'
import App from './App.jsx'
import { LanguageProvider } from './LanguageContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </I18nextProvider>
    </BrowserRouter>
  </StrictMode>,
)
