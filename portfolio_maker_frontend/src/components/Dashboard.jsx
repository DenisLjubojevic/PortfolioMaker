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
    Heading,
} from '@chakra-ui/react';

import apiClient from '../axiosConfig';

import AdminPortfolioListComponent from './AdminPortfolioListComponent';

function Dashboard() {
    const [portfolios, setPortfolios] = useState([]);
    const [reportedPortfolios, setReportedPortfolios] = useState([]);
    const [creatingPortfolio, setCreatingPortfolio] = useState(false);
    const [editingPortfolio, setEditingPortfolio] = useState(null);

    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');

    const userRole = localStorage.getItem('userRole');

    const fetchReportedPortfolios = async () => {
        try {
            const response = await apiClient.get('https://localhost:7146/api/portfolio/reported');
            setReportedPortfolios(response.data);
        } catch (error) {
            console.error('Failed to fetch reported portfolios:', error);
        }
    }

    const fetchUserPortfolios = async () => {
        try {
            const response = await apiClient.get('https://localhost:7146/api/portfolio/user');
            setPortfolios(response.data);
        } catch (error) {
            console.error('Failed to fetch user portfolios:', error);
        }
    }

    useEffect(() => {
        if (token) {
            fetchUserPortfolios();
            if (userRole == "ADMIN") {
                fetchReportedPortfolios();
            }
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
        fetchUserPortfolios();
    };

    const handleCancle = () => {
        setCreatingPortfolio(false);
        setEditingPortfolio(null);
        fetchUserPortfolios();
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
                    padding="5px"
                    flexDir="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Box
                        width="97vw"
                        height="75vh"
                        border="2px solid black"
                        borderRadius="5px"
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
                                <Heading
                                    as="h2"
                                    size="lg"
                                    mt={15}
                                    textAlign="center"
                                    color="brand.primary.800"
                                >
                                    Your Portfolios
                                </Heading>
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

                    {userRole == "ADMIN" ? (
                        <Box
                            width="97vw"
                            height="75vh"
                            border="2px solid black"
                            borderRadius="5px"
                            minW={{ base: "90%", md: "468px" }}
                            padding="10px"
                            bg="brand.secondary.800"
                            overflow="auto"
                        >
                            <Heading
                                as="h2"
                                size="lg"
                                textAlign="center"
                                color="brand.primary.800"
                            >
                                Reported Portfolios
                            </Heading>
                            <AdminPortfolioListComponent
                                portfolios={reportedPortfolios}
                                onReportRemoved={fetchReportedPortfolios}
                            />
                        </Box>
                    ) : (
                        <></>
                    )}
                </Stack>
            </Box>
        </Flex>
    );
}

export default Dashboard;
