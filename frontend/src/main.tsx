import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx' // New import

/*
async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    return;
  }
  const { worker } = await import('./mocks/browser');
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
*/

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* New: Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
