import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

import PortfolioBuilder from './CreatePortfolio/PortfolioBuilder';
import PortfolioList from './PortfolioList';

import {
    Box,
    Text,
    Button,
    Flex,
    Stack,
} from '@chakra-ui/react';

import apiClient from '../axiosConfig';

function Dashboard() {
    const [portfolios, setPortfolios] = useState([]);
    const [creatingPortfolio, setCreatingPortfolio] = useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');

    const fetchPortfolios = async () => {
        try {
            const response = await apiClient.get('https://localhost:7146/api/portfolio');
            setPortfolios(response.data);
        } catch (error) {
            console.error('Failed to fetch portfolios:', error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchPortfolios();
        } else {
            console.error("Token is missing, navigating to login page.");
            navigate('/');
        }
    }, [navigate, token]);

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            justifyContent="center"
            alignItems="center"
        >
            <Navbar token={token} />
            <Box
                width="100vw"
                height="95vh"
            >
                <Text
                    fontSize="3xl"
                    marginTop="20px"
                    mb={4}
                >
                    Welcome to your Dashboard
                </Text>
                <Stack
                    flexDir="row"
                    mb="2"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box
                        width="10%"
                        height="75vh"
                        borderRadius="10px"
                        minW={{ base: "0%", md: "268px" }}
                    >
                        <Text
                            fontSize="2xl"
                            mb={4}
                        >
                            SIDEBAR
                        </Text>
                    </Box>
                    <Box
                        width="80vw"
                        height="75vh"
                        borderRadius="10px"
                        minW={{ base: "90%", md: "468px" }}
                        padding="10px"
                    >
                        {!creatingPortfolio ? (
                            <>
                                <Button
                                    onClick={() => setCreatingPortfolio(true)}
                                    float="right"
                                >
                                    Create New Portfolio
                                </Button>
                                <PortfolioList portfolios={portfolios} />
                            </>
                        ) : (
                            <PortfolioBuilder
                                onPortfolioCreated={() => {
                                    fetchPortfolios();
                                    setCreatingPortfolio(false);
                                }}
                            />
                        )}
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );
}

export default Dashboard;
