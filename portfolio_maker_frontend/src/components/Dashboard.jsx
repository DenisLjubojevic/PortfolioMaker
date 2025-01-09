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
    const [editingPortfolio, setEditingPortfolio] = useState(null);

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


    const handleEditPortfolio = (portfolio) => {
        setEditingPortfolio(portfolio);
        setCreatingPortfolio(false);
    }

    const handlePortfolioSaved = () => {
        setCreatingPortfolio(false);
        setEditingPortfolio(null);
        fetchPortfolios();
    };

    const handleCancle = () => {
        setCreatingPortfolio(false);
        setEditingPortfolio(null);
    }

    return (
        <Flex
            flexDirection="column"
            width="100wh"
            height="100vh"
            justifyContent="center"
            alignItems="center"
            bg="brand.primary.800"
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
                    color="brand.secondary.800"
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
                        bg="brand.secondary.800"
                    >
                        <Text
                            fontSize="2xl"
                            mb={4}
                            color="brand.primary.800"
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
                        bg="brand.secondary.800"
                    >
                        {!(creatingPortfolio || editingPortfolio) ? (
                            <>
                                <Button
                                    onClick={() => setCreatingPortfolio(true)}
                                    float="right"
                                >
                                    Create New Portfolio
                                </Button>
                                <PortfolioList
                                    portfolios={portfolios}
                                    onEditPortfolio={handleEditPortfolio}
                                />
                            </>
                        ) : (
                            <>
                                <Button
                                    position="absolute"
                                    right="40px"
                                    top="150px"
                                    bg="brand.secondary.800"
                                    color="brand.primary.800"
                                    onClick={handleCancle}
                                    float="right"
                                >
                                    Cancel
                                </Button>
                                <PortfolioBuilder
                                    initialData={editingPortfolio}
                                    onPortfolioCreated={handlePortfolioSaved}
                                />
                            </>
                        )}
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );
}

export default Dashboard;
