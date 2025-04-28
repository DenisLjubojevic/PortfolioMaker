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

function PublicPortfolioListComponent({ portfolios }) {
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
                                bg="brand.primary.800"
                                color="brand.secondary.800"
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
                                                color: "white"
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