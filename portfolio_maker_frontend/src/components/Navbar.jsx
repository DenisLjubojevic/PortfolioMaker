import { useEffect } from 'react';
import { Box, Flex, Spacer, Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

import apiClient from '../axiosConfig';

import { FaSun } from "react-icons/fa";

import { FaMoon } from "react-icons/fa6";

import { jwtDecode } from 'jwt-decode';

function Navbar() {
    const navigate = useNavigate();

    const { theme, toggleTheme } = useTheme();

    const isExpired = (token) => {
        if (!token) return true;
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp < currentTime;
        } catch (error) {
            console.log("Error decoding token: ", error);
            return true;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (isExpired(token)) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            navigate('/');
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const url = 'https://localhost:7146/api/auth/logout';
            await apiClient.post(url, {});
        } catch (error) {
            console.log('Error during logout', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userId');
            navigate("/");
        }
    };
    const home = () => {
        navigate("/dashboard");
    }

    const browse = () => {
        navigate("/browse");
    }

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
                        onClick={home}
                        style={{ boxShadow: 'none' }}
                    >
                        Home
                    </Button>
                    <Button
                        size="sm"
                        onClick={browse}
                        style={{ boxShadow: 'none' }}
                    >
                        Browse
                    </Button>
                    <Button
                        size="sm"
                        onClick={toggleTheme}
                        style={{ boxShadow: 'none' }}
                    >
                        { theme === "dark" ? ( <FaSun></FaSun> ) : ( <FaMoon></FaMoon> )}
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