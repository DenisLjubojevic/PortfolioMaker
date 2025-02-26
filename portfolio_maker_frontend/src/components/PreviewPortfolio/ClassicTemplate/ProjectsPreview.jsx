import PropTypes from 'prop-types';
import { Box, Heading, Text, Link, VStack } from "@chakra-ui/react";

function ProjectsPreview({ data }) {
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
            <Heading
                size="xl" mb={6}
                fontFamily="'Playfair Display', serif"
            >
                Projects
            </Heading>
            <VStack align="stretch" spacing={4}>
                {data.map((project) => (
                    <Box
                        key={project.id}
                        p={4}
                        border="1px"
                        borderColor="brand.primary.800"
                        borderRadius="md"
                        backgroundColor="brand.primary.900"
                    >
                        <Text fontSize="xl" fontWeight="bold">
                            {project.title}
                        </Text>
                        <Text>{project.description}</Text>
                        <Box mt={2}>
                            <Link href={project.demoUrl} color="blue.500" isExternal>
                                Demo
                            </Link>
                            {' | '}
                            <Link href={project.repoUrl} color="blue.500" isExternal>
                                Repository
                            </Link>
                        </Box>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}

ProjectsPreview.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string,
            demoUrl: PropTypes.string,
            repoUrl: PropTypes.string,
        })
    ).isRequired,
}

export default ProjectsPreview;