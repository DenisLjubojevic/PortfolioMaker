import { Box, Text, Image, VStack, HStack, Link, Collapse } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useState } from 'react';
function ProjectCard({ project }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Box
            borderRadius="md"
            p={4}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            transition="all 0.3s ease"
            _hover={{ boxShadow: 'lg' }}
        >
            <Text fontWeight="bold" fontSize="xl">
                {project.title}
            </Text>

            <Text noOfLines={1}>
                {project.description}
            </Text>
            <Collapse in={isHovered} animateOpacity>
                <VStack align="start" mt={2}>
                    <Image
                        src={`https://localhost:7146/api/portfolio/profile-picture/${project.imageId}`}
                        alt="Project Image"
                        boxSize={{ base: "100px", md: "150px" }}
                        mb={4}
                    />
                    <Text>{project.description}</Text>
                    <Text fontSize="sm">
                        Technologies: {project.technologies.join(', ')}
                    </Text>

                    <HStack spacing={4} mt={2}>
                        {project.demoUrl && (
                            <Link href={project.demoUrl} isExternal color="gray.50" _hover={{ color: "gray.200" }}>
                                Live Demo <ExternalLinkIcon mx="2px" />
                            </Link>
                        )}
                        {project.repoUrl && (
                            <Link href={project.repoUrl} isExternal color="gray.50" _hover={{ color: "gray.200" }}>
                                Source Code <ExternalLinkIcon mx="2px" />
                            </Link>
                        )}
                    </HStack>
                </VStack>
            </Collapse>
        </Box>
    );
}

export default ProjectCard;