import * as PropTypes from 'prop-types';
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Stack,
    Button,
    Link as ChakraLink,
} from '@chakra-ui/react';

import { FaEdit } from "react-icons/fa";

import { Link as ReactRouterLink } from 'react-router-dom'

function PortfolioList({ portfolios, onEditPortfolio }) {

    return (
        <div>
            {portfolios.length === 0 ? (
                <p>No portfolios found!</p>
            ) : (
                    <Box p={8}>
                        <Heading
                            as="h2"
                            size="lg"
                            mb={4}
                            textAlign="center"
                            color="brand.primary.800"
                            marginTop="10px"
                        >
                            Your Portfolios
                        </Heading>
                        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
                            {portfolios.map((portfolio, index) => (
                                <Box
                                    key={index}
                                    p={5}
                                    bg="brand.primary.800"
                                    color="brand.secondary.800"
                                    shadow="md"
                                    borderWidth="1px"
                                    borderRadius="md"
                                    _hover={{ shadow: "lg" }}
                                >
                                    <Stack>
                                        <Heading as="h3" size="md">
                                            {portfolio.name}
                                        </Heading>
                                        <Text>{portfolio.description}</Text>
                                        <ChakraLink as={ReactRouterLink} target="_blank" to={`/preview/${portfolio.id}`}>
                                            {portfolio.portfolioUrl}
                                        </ChakraLink>
                                        <Button
                                            bg="brand.secondary.800"
                                            color="brand.primary.800"
                                            onClick={() => onEditPortfolio(portfolio)}
                                        >
                                            <FaEdit /> Edit
                                        </Button>
                                    </Stack>
                                </Box>
                            ))}
                        </SimpleGrid>
                    </Box>
            )}
        </div>
    );
}

PortfolioList.propTypes = {
    portfolios: PropTypes.array.isRequired,
    onEditPortfolio: PropTypes.func.isRequired,
};

export default PortfolioList;