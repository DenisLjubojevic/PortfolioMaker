import PropTypes from 'prop-types';
import { Flex, Box, Text, Image } from "@chakra-ui/react";

function AboutPreview({ data }) {
    return (
        <Box
            id="about"
            py={10}
            px={6}
            bg="gray.300"
            width="60%"
            height="80%"
            borderRadius="md"
            boxShadow="sm"
        >
            <Flex direction="column" align="center" justifyContent="center">
                <Image
                    src={`https://localhost:7146/api/portfolio/profile-picture/${data.profilePictureId}`}
                    alt="Profile Picture"
                    boxSize={{ base: "100px", md: "150px" }}
                    borderRadius="full"
                    mb={4}
                />
                <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" mb={2}>
                    {data.name}
                </Text>
                <Text fontSize="xl" textAlign="center">
                    {data.bio}
                </Text>
            </Flex>
        </Box>
    );
}

AboutPreview.propTypes = {
    data: PropTypes.shape({
        profilePictureId: PropTypes.string,
        name: PropTypes.string,
        bio: PropTypes.string,
    }).isRequired,
};

export default AboutPreview;