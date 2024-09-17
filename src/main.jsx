import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Modal from 'react-modal'
import App from './App.jsx'
import './index.css'

// Set the app element for react-modal
Modal.setAppElement('#root');
console.log("Firebase API Key:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("Firebase Auth Domain:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log("Firebase Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
