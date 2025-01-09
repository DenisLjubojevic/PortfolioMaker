import PropTypes from 'prop-types';
import { Box, Text, Image } from "@chakra-ui/react";

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
            {data.profilePictureId && (
                <Image
                    src={`https://localhost:7146/api/portfolio/profile-picture/${data.profilePictureId}`}
                    alt="Profile Picture"
                    boxSize="150px"
                    borderRadius="full"
                    objectFit="cover"
                />
            )}

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
        profilePictureId: PropTypes.string,
        name: PropTypes.string,
        bio: PropTypes.string,
    }).isRequired,
};

export default AboutPreview;