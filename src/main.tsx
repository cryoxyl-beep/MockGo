import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { DriveProvider } from './context/DriveContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DriveProvider>
        <App />
      </DriveProvider>
    </AuthProvider>
  </StrictMode>,
);
