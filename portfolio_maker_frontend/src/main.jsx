import { StrictMode } from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import customTheme from "./theme";
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Render the app with ChakraProvider and the custom theme
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ChakraProvider theme={customTheme}>
            <ColorModeScript initialColorMode={customTheme.config.initialColorMode} />
            <App />
        </ChakraProvider>
    </StrictMode>
);
