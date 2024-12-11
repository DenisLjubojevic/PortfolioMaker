import * as PropTypes from 'prop-types';
import { Box, Flex, Spacer, Button, Heading } from "@chakra-ui/react";
function Navbar({ onLogout }) {

    return (
        <Box
            as="nav"
            bg="teal.500"
            color="white"
            px={4}
            py={2}
            boxShadow="md"
            position="sticky"
            top="0"
            zIndex="1000"
            width="100%"
        >
            <Flex alignItems="center" justifyContent="space-between" width="100%">
                <Heading as="h1" size="lg">
                    Portfolio Maker
                </Heading>

                <Spacer />
                <Flex alignItems="center" gap={4}>
                    <Button size="sm" colorScheme="red" onClick={onLogout}>
                        Logout
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}

Navbar.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

export default Navbar;