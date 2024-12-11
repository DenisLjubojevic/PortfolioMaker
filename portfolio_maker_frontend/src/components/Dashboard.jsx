import { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';

import PortfolioBuilder from './CreatePortfolio/PortfolioBuilder';
import PortfolioList from './PortfolioList';

import { Box, Text, Button } from '@chakra-ui/react';

function Dashboard({ token }) {
    const [portfolios, setPortfolios] = useState([]);
    const [creatingPortfolio, setCreatingPortfolio] = useState(false);

    const fetchPortfolios = async () => {
        try {
            const response = await axios.get('/api/portfolio', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPortfolios(response.data);
        } catch (error) {
            console.error('Failed to fetch portfolios:', error);
        }
    }

    useEffect(() => {
        fetchPortfolios();
    }, []);

    return (
        <Box padding="4" bg="gray.50" minHeight="100vh">
            <Text fontSize="2xl" mb={4}>Welcome to your Dashboard</Text>
            {!creatingPortfolio ? (
                <>
                    <Button onClick={() => setCreatingPortfolio(true)}>Create New Portfolio</Button>
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
    );
}

Dashboard.propTypes = {
    token: PropTypes.string.isRequired,
};

export default Dashboard;
