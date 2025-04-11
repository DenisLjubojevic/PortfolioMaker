import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

import {
    Box,
    Flex,
    Heading,
    Stack,
} from '@chakra-ui/react';

import apiClient from '../../axiosConfig';

import PublicPortfolioList from './PublicPortfolioListComponent';

function BrowsePortfoliosComponent() {
    const [portfolios, setPortfolios] = useState([]);

    const navigate = useNavigate();

    const token = localStorage.getItem('authToken');

    const fetchPortfolios = async () => {
        try {
            const response = await apiClient.get('https://localhost:7146/api/portfolio/public');
            setPortfolios(response.data);
        } catch (error) {
            console.error('Failed to fetch user portfolios:', error);
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
            justifyContent="FlexStart"
            alignItems="center"
            bg="brand.primary.800"
        >
            <Navbar token={token} />
            <Stack
                padding="5px"
                flexDir="row"
                justifyContent="flexStart"
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
                    mt={10}
                >
                    <Heading
                        as="h2"
                        size="lg"
                        mt={15}
                        textAlign="center"
                        color="brand.primary.800"
                    >
                        Explore other portfolios
                    </Heading>
                    <PublicPortfolioList
                        portfolios={portfolios}
                    />
                </Box>
            </Stack>
        </Flex>
  );
}

export default BrowsePortfoliosComponent;