import { Box, Flex, Spacer, Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import apiClient from '../axiosConfig';

function Navbar() {
    const navigate = useNavigate();

    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        try {
            const url = 'https://localhost:7146/api/auth/logout';
            await apiClient.post(url, {});
        } catch (error) {
            console.log('Error during logout', error);
        } finally {
            localStorage.removeItem('authToken');
            navigate("/");
        }
    };

    return (
        <Box
            as="nav"
            bg="brand.secondary.800"
            color="brand.primary.800"
            px={4}
            py={2}
            boxShadow="md"
            position="sticky"
            top="0"
            zIndex="1000"
            width="100%"
        >
            <Flex alignItems="center" justifyContent="space-between" width="100%">
                <Heading as="h1" size="lg">
                    Portfolio Maker
                </Heading>

                <Spacer />
                <Flex alignItems="center" gap={4}>
                    <Button
                        size="sm"
                        onClick={toggleTheme}
                        style={{ boxShadow: 'none' }}
                    >
                        Toggle {theme === "light" ? "dark" : "light"}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleLogout}
                        style={{ boxShadow: 'none' }}
                    >
                        Logout
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}

export default Navbar;