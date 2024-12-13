import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
    colors: {
        brand: {
            light: "#f0e68c", // Light mode custom color
            dark: "#2f4f4f",  // Dark mode custom color
        },
        primary: "#6b46c1",
        secondary: "#d53f8c",
    },
    components: {
        Button: {
            // Define styles for Button component
            baseStyle: (props) => ({
                bg: props.colorMode === "dark" ? "brand.light" : "brand.dark",
                color: "white",
                _hover: {
                    bg: props.colorMode === "dark" ? "gray.700" : "gray.300",
                },
            }),
        },
        Box: {
            baseStyle: (props) => ({
                bg: props.colorMode === "dark" ? "#6b46c1" : "brand.light",
                borderColor: props.colorMode === "dark" ? "brand.dark" : "brand.light",
                color: props.colorMode === "dark" ? "brand.light" : "brand.dark",
            }),
            
        },
    },
});

export default customTheme;