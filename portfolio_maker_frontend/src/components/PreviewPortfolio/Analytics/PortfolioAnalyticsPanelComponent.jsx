import * as PropTypes from 'prop-types';

import { Box, Heading, VStack } from '@chakra-ui/react';

import { useEffect, useState } from 'react';
import apiClient from '../../../axiosConfig';

import DailyViewChart from './DailyViewChart';
import TotalViewsStat from './TotalViewsStat';

function PortfolioAnalyticsPanelComponent({ portfolioId }) {
    const [loading, setLoading] = useState(true);
    const [totalViews, setTotalViews] = useState({});
    const [timeSeries, setTimeSeries] = useState({});

    useEffect(() => {
        if (!portfolioId) return;
        setLoading(true);

        Promise.all([
            apiClient.get(`https://localhost:7146/api/analytics/portfolio/${portfolioId}/views`),
            apiClient.get(`https://localhost:7146/api/analytics/portfolio/${portfolioId}/timeseries`)
        ])
            .then(([viewsRes, timeseriesRes]) => {
                setTotalViews(prev => ({
                    ...prev,
                    [portfolioId]: viewsRes.data.views
                }));
                setTimeSeries(prev => ({
                    ...prev,
                    [portfolioId]: timeseriesRes.data
                }));
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [portfolioId]);

    if (loading) {
        return <div>Loading...</div>;
    } else {
        return (
            <VStack align="stretch" spacing={6} p={4}>
                <Heading size="md">Analytics</Heading>
                <TotalViewsStat totalViews={totalViews[portfolioId]} />
                <Box>
                    <Heading size="sm" mb={2}>Daily Page Views</Heading>
                    <DailyViewChart data={timeSeries[portfolioId]} />
                </Box>
            </VStack>
        );
    }
}

PortfolioAnalyticsPanelComponent.propTypes = {
    portfolioId: PropTypes.string.isRequired,
};

export default PortfolioAnalyticsPanelComponent;