import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ErrorSnackbarProvider } from "./context/ErrorSnackbarContext";
import GlobalErrorSnackbar from './components/GlobalErrorSnackbar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorSnackbarProvider>
      <App />
      <GlobalErrorSnackbar/>
    </ErrorSnackbarProvider>
  </StrictMode>,
)
