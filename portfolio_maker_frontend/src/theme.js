import { extendTheme } from "@chakra-ui/react";

const lightTheme = extendTheme({
    colors: {
        brand: {
            primary: {
                900: "#b0c7db",
                800: "#c9dae7",
                700: "#e3edf3",
            },
            secondary: {
                900: "#54659e",
                800: "#738ab6",
                700: "#99b2cf",
            },
        },
        login: {
            primary: {
                900: "#54659e",
                800: "#738ab6",
                700: "#99b2cf",
                600: "#b0c7db",
                500: "#c9dae7",
                400: "#e3edf3",
                300: "#ffffff",
            }
        },
        background: "#ffffff",
        text: "#333333",
    },
    styles: {
        global: {
            body: {
                bg: "brand.background",
                color: "brand.text",
            },
        },
    },
    components: {
        Stepper: {
            baseStyle: {
                step: {
                    flexDirection: "column",
                },
                stepIndicator: {
                    bg: "brand.primary.700",
                    borderColor: "brand.primary.900",
                    borderWidth: "2px",
                    _active: {
                        bg: "brand.secondary.700",
                        borderColor: "brand.secondary.900",
                    },
                    _complete: {
                        bg: "brand.secondary.900",
                        borderColor: "brand.secondary.800",
                    },
                    _hover: {
                        bg: "brand.primary.900",
                    },
                },
                stepTitle: {
                    color: "brand.primary.900",
                    fontWeight: "bold",
                },
                stepDescription: {
                    color: "brand.primary.700",
                    fontSize: "sm",
                },
                stepSeparator: {
                    borderColor: "brand.secondary.900",
                },
            },
            variants: {
                solid: {
                    stepIndicator: {
                        bg: "brand.primary.800",
                        color: "white",
                        borderColor: "brand.secondary.900",
                    },
                },
            },
            defaultProps: {
                variant: "solid",
            },
        },
        Button: {
            baseStyle: {
                bg: "brand.primary.800",
                color: "brand.secondary.800",
                _hover: {
                    bg: "brand.secondary.900",
                    color: "brand.primary.700",
                    transform: "scale(1.05)",
                    border: "2px solid",
                    borderColor: "brand.primary.900",
                },
                _focus: {
                    outline: "none",
                },
            },
            variants: {
                base: {},
                active: {
                    bg: "brand.secondary.800",
                    color: "brand.primary.800",
                    _hover: {
                        border: "2px solid",
                        borderColor: "brand.secondary.900",
                    }

                }
            },
            defaultProps: {
                variant: 'base'
            }
        }
    },
});

const darkTheme = extendTheme({
    colors: {
        brand: {
            primary: {
                900: "#276228",
                800: "#2C5F2D",
                700: "#446945",
            },
            secondary: {
                900: "#79a838",
                800: "#97BC62",
                700: "#a4c771",
            },
        },
        login: {
            primary: {
                900: "#54659e",
                800: "#738ab6",
                700: "#99b2cf",
                600: "#b0c7db",
                500: "#c9dae7",
                400: "#e3edf3",
                300: "#ffffff",
            }
        },
        background: "#1a202c",
        text: "#ffffff",
    },
    styles: {
        global: {
            body: {
                bg: "brand.background",
                color: "brand.text",
            }
        },
    },
    components: {
        Stepper: {
            baseStyle: {
                step: {
                    flexDirection: "column",
                },
                stepIndicator: {
                    bg: "brand.primary.700",
                    borderColor: "brand.primary.900",
                    borderWidth: "2px",
                    _active: {
                        bg: "brand.secondary.700",
                        borderColor: "brand.secondary.900",
                    },
                    _complete: {
                        bg: "brand.secondary.900",
                        borderColor: "brand.secondary.800",
                    },
                    _hover: {
                        bg: "brand.primary.900",
                    },
                },
                stepTitle: {
                    color: "brand.primary.900",
                    fontWeight: "bold",
                },
                stepDescription: {
                    color: "brand.primary.700",
                    fontSize: "sm",
                },
                stepSeparator: {
                    borderColor: "brand.secondary.900",
                },
            },
            variants: {
                solid: {
                    stepIndicator: {
                        bg: "brand.primary.800",
                        color: "white",
                        borderColor: "brand.secondary.900",
                    },
                },
            },
            defaultProps: {
                variant: "solid",
            },
        },
        Button: {
            baseStyle: {
                bg: "brand.primary.800",
                color: "brand.secondary.800",
                _hover: {
                    bg: "brand.secondary.900",
                    color: "brand.primary.700",
                    transform: "scale(1.05)",
                    border: "2px solid",
                    borderColor: "brand.primary.900",
                },
                _focus: {
                    outline: "none",
                }

            },
            variants: {
                base: {},
                inverted: {
                    bg: "brand.secondary.800",
                    color: "brand.primary.800",
                    _hover: {
                        border: "2px solid",
                        borderColor: "brand.secondary.900",
                    }

                }
            },
            defaultProps: {
                variant: 'base'
            },
        },
    },
});

export { lightTheme, darkTheme };