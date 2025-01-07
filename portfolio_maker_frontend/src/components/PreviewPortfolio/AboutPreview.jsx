import PropTypes from 'prop-types';
import { Box, Text } from "@chakra-ui/react";

function AboutPreview({ data }) {
    return (
        <Box
            id="about"
            py={8}
            px={4}
            bg="gray.300"
            width="60%"
            height="80%"
            borderRadius="md"
            fontSize="2xl"
        >
            <Text fontSize="3xl" fontWeight="bold" mb={4}>
                { data.name }
            </Text>
            <Text>
                {data.bio}
            </Text>
        </Box>
    );
}

AboutPreview.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string,
        bio: PropTypes.string,
    }).isRequired,
};

export default AboutPreview;