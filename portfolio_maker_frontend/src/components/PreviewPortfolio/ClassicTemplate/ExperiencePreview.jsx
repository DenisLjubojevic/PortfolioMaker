import PropTypes from 'prop-types';
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
function ExperiencePreview({ data }) {
    return (
        <Box
            id="about"
            py={8}
            px={4}
            bg="gray.300"
            width="60%"
            height="80%"
            borderRadius="md"
        >
            <Heading size="xl" mb={6}>
                Work Experience
            </Heading>

            {data.length > 0 ? (
                <VStack align="stretch" spacing={4}>
                    {data.map((experience) => (
                        <Box
                            key={experience.id}
                            p={4}
                            border="1px"
                            borderColor="brand.primary.800"
                            borderRadius="md"
                            backgroundColor="brand.primary.900"
                        >
                            <Text fontSize="xl" fontWeight="bold">
                                {experience.position}
                            </Text>
                            <Text>Started working: {experience.startedWorking}, Ended Working: {experience.endedWorking}</Text>
                            <Text>{experience.company}</Text>

                        </Box>
                    ))}
                </VStack>
            ) : (
                <Text>Currently, there are no work experiences to display.</Text>
            )}
        </Box>
    );
}

ExperiencePreview.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            position: PropTypes.string,
            startedWokring: PropTypes.string,
            endedWorking: PropTypes.string,
            company: PropTypes.string,
        })
    ).isRequired,
}

export default ExperiencePreview;