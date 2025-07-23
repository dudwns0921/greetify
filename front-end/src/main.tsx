import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { LoadingProvider } from './provider/LoadingProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LoadingProvider>
            <App />
        </LoadingProvider>
    </StrictMode>
)
