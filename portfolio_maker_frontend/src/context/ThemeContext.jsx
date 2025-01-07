import { createContext, useContext, useState } from "react";
import * as PropTypes from 'prop-types';
import { ChakraProvider } from "@chakra-ui/react";
import { lightTheme, darkTheme } from "../theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");

    const activateTheme = (newTheme) => {
        setTheme(newTheme);
    }

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const activeTheme = theme === "light" ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ theme, activateTheme, toggleTheme }}>
            <ChakraProvider theme={activeTheme}>
                {children}
            </ChakraProvider>
        </ThemeContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useTheme() {
    return useContext(ThemeContext);
}

export { ThemeContext };