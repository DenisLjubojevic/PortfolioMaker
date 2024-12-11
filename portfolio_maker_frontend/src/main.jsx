import { StrictMode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';


// Render the app with ChakraProvider and the custom theme
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ChakraProvider>
            <App />
        </ChakraProvider>
    </StrictMode>
);
