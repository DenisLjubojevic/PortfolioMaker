import * as PropTypes from 'prop-types';
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    HStack,
    Stack,
    Link as ChakraLink,
} from '@chakra-ui/react';

import { Link as ReactRouterLink } from 'react-router-dom'

import { FaLink } from "react-icons/fa";

import { FaStar } from "react-icons/fa";
import { useState, useEffect } from 'react';
import apiClient from '../../axiosConfig';

function PublicPortfolioListComponent({ portfolios }) {
    const [stats, setStats] = useState({});

    useEffect(() => {
        const loads = portfolios.map(async (p) => {
            const resp = await apiClient.get(`https://localhost:7146/api/review/portfolio/${p.id}`);

            const reviews = resp.data;
            if (Array.isArray(reviews) && reviews.length > 0) {
                const count = reviews.length;
                const sum = reviews.reduce((sum, r) => sum + r.mark, 0);
                const avg = sum / reviews.length;
                return [p.id, { avg, count }];
            } else {
                return [p.id, { avg: 0, count: 0 }];
            };
        })


        Promise.all(loads).then((pairs) => {
            setStats(Object.fromEntries(pairs));
        });
    }, [portfolios]);

    const bgColor = {
        reported: "brand.reported.700",
        default: "brand.primary.800",
    };

    const textColor = {
        reported: "brand.reported.600",
        default: "brand.secondary.900",
    };

    const colors = {
        orange: "#f08800",
        grey: "#b3b3b3",
    };

    const stars = Array(5).fill(0);

    return (
        <div>
            {portfolios.length === 0 ? (
                <Text fontSize="2xl" color="brand.secondary.900" fontWeight="bold">No public portfolios found!</Text>
            ) : (
                <Box p={8}>
                        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
                            {portfolios.map((portfolio, index) => (
                                <Box
                                    key={index}
                                    p={5}
                                    bg={portfolio.isReported ? bgColor.reported : bgColor.default}
                                    color={portfolio.isReported ? textColor.reported : textColor.default}
                                    shadow="md"
                                    borderRadius="md"
                                    _hover={{ shadow: "lg" }}
                                >
                                    <Stack>
                                        <Heading as="h3" size="md">
                                            {portfolio.name}
                                        </Heading>
                                        <Text>{portfolio.description}</Text>
                                        <HStack
                                            justifyContent="center"
                                            p={3}
                                            width="auto"
                                            bg={portfolio.isReported ? "yellow" : ""}
                                            color={portfolio.isReported ? "black" : "brand.secondary.900"}
                                        >
                                            {stars.map((_, index) => {
                                                return (
                                                    <FaStar
                                                        key={index}
                                                        size={24}
                                                        color={(stats[portfolio.id]?.avg ?? 0) > index ? colors.orange : colors.grey}
                                                    />
                                                )
                                            })}
                                            <Text>({stats[portfolio.id]?.count ?? 0}) review{stats[portfolio.id]?.count === 1 ? '' : 's'}</Text>
                                        </HStack>
                                        <HStack
                                            fontStyle="italic"
                                            width="fit-content"
                                            margin="0 auto"
                                        >
                                            <FaLink />
                                            <ChakraLink
                                                as={ReactRouterLink}
                                                target="_blank"
                                                to={`/preview/${portfolio.id}`}
                                                _hover={{
                                                    textDecoration: "none",
                                                    color: portfolio.isReported ? "black" : "white",
                                                }}
                                            >
                                                Link
                                            </ChakraLink>
                                        </HStack>
                                    </Stack>
                                </Box>
                            ))}
                    </SimpleGrid>
                </Box>
            )}
        </div>
    );
}

PublicPortfolioListComponent.propTypes = {
    portfolios: PropTypes.array.isRequired
};

export default PublicPortfolioListComponent;