import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

import {
    Box,
    Flex,
    Heading,
    HStack,
    Stack,
    Input,
    Button,
} from '@chakra-ui/react';

import apiClient from '../../axiosConfig';

import PublicPortfolioList from './PublicPortfolioListComponent';

function BrowsePortfoliosComponent() {
    const [portfolios, setPortfolios] = useState([]);
    const [searchBar, setSearchBar] = useState("");

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

    const handleSearchBar = (search) => {
        console.log(search);
        setSearchBar(search);
    }

    const searchPortfolios = async () => {
        if (searchBar != "") {
            try {
                const response = await apiClient.get(`https://localhost:7146/api/portfolio/search/${searchBar}`);
                setPortfolios(response.data);
            } catch (error) {
                console.error('Failed to fetch searched portfolios:', error);
            }
        } else {
            try {
                const response = await apiClient.get('https://localhost:7146/api/portfolio/public');
                setPortfolios(response.data);
            } catch (error) {
                console.error('Failed to fetch user portfolios:', error);
            }
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
                    <HStack m={4}>
                        <Input
                            placeholder="Search bar"
                            value={searchBar}
                            onChange={(e) => handleSearchBar(e.target.value)}
                            bg='brand.primary.800'
                            color="brand.secondary.800"
                            borderColor="brand.primary.900"
                            outline="0"
                            _placeholder={{
                                color: "brand.secondary.900",

                            }}
                            _focus={{
                                boxShadow: "none",
                                border: "2px solid",
                                borderColor: "brand.secondary.900",
                            }}
                        />
                        <Button
                            onClick={() => searchPortfolios()}
                            mr={3}
                        >
                            Search
                        </Button>
                    </HStack>
                    <PublicPortfolioList
                        mt={4}
                        portfolios={portfolios}
                    />
                </Box>
            </Stack>
        </Flex>
  );
}

export default BrowsePortfoliosComponent;