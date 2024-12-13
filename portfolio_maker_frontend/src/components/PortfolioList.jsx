import * as PropTypes from 'prop-types';
import { Box, Heading, Text, SimpleGrid, Stack } from '@chakra-ui/react';

function PortfolioList({ portfolios }) {
    return (
        <div>
            {portfolios.length === 0 ? (
                <p>No portfolios found!</p>
            ) : (
                    <Box p={8}>
                        <Heading as="h2" size="lg" mb={4} textAlign="center">
                            Your Portfolios
                        </Heading>
                        <SimpleGrid columns={[1, 2, 3]} spacing={8}>
                            {portfolios.map((portfolio, index) => (
                                <Box
                                    key={index}
                                    p={5}
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
};

export default PortfolioList;