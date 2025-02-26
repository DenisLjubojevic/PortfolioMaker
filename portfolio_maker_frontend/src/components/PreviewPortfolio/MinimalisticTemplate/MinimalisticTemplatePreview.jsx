import {
    Button,
    Box,
    Flex,
    Heading,
    Text,
    Image,
    Grid,
    Link,
    VStack,
    HStack,
    useColorModeValue,
} from "@chakra-ui/react";
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function MinimalisticTemplatePreview({ portfolioData }) {
    const bgColor = useColorModeValue('#D3D9D4', 'gray.800');
    const accentColor = useColorModeValue('#748D92', 'teal.300');

    const fontColor = "#124E66";

    return (
        <Flex direction="column" width="99vw" bg={bgColor} fontFamily="'Roboto', sans-serif">
            <Flex
                as="nav"
                bg="whiteAlpha.900"
                p={4}
                boxShadow="sm"
                position="sticky"
                top="0"
                zIndex="10"
                fontFamily="'Montserrat', sans-serif"
            >
                <HStack
                    spacing={8}
                    mx="auto"
                >
                    <Text color={fontColor} fontSize="lg">Portfolio Maker</Text>
                    <Link
                        href="#about"
                        color={accentColor}
                        _hover={{
                            color: "#212A31",
                        }}
                    >About</Link>
                    <Link
                        href="#experience"
                        color={accentColor}
                        _hover={{
                            color: "#212A31",
                        }}
                    >Experience</Link>
                    <Link
                        href="#projects"
                        color={accentColor}
                        _hover={{
                            color: "#212A31",
                        }}
                    >Projects</Link>
                    <Link
                        href="#contact"
                        color={accentColor}
                        _hover={{
                            color: "#212A31",
                        }}
                    >Contact</Link>
                </HStack>
            </Flex>

            <Box px={8} py={12}>
                <Box id="about" mb={12} maxW="800px" mx="auto" color={fontColor}>
                    <Flex align="center" justify="center" direction="column">
                        {portfolioData.about.profilePictureId && (
                            <Image
                                src={`https://localhost:7146/api/portfolio/profile-picture/${portfolioData.about.profilePictureId}`}
                                alt="Profile"
                                boxSize="150px"
                                borderRadius="full"
                                objectFit="cover"
                                mb={4}
                            />
                        )}
                        <Heading as="h2" size="xl" mb={2} fontFamily="'Playfair Display', serif">
                            {portfolioData.about.name}
                        </Heading>
                        <Text fontSize="lg" textAlign="center" maxW="600px">
                            {portfolioData.about.bio}
                        </Text>
                    </Flex>
                </Box>

                <Box id="experience" mb={12} maxW="800px" mx="auto" color={fontColor}>
                    <Heading as="h2" size="lg" mb={6} textAlign="center" fontFamily="'Playfair Display', serif">
                        Work Experience
                    </Heading>
                    {portfolioData.experience && portfolioData.experience.length > 0 ? (
                        <VStack spacing={6}>
                            {portfolioData.experience.map((exp) => (
                                <MotionBox
                                    key={exp.id}
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    width="100%"
                                    maxW="800px"
                                    boxShadow="sm"
                                    whileHover={{ scale: 1.02, boxShadow: "lg" }}
                                    bgColor="gray.50"
                                >
                                    <Heading as="h3" size="md" mb={2} fontFamily="'Playfair Display', serif">
                                        {exp.position} at {exp.company}
                                    </Heading>
                                    <Text fontSize="sm">
                                        {exp.startedWorking} - {exp.endedWorking}
                                    </Text>
                                    <Text mt={2}>{exp.responsibilities.join(', ')}</Text>
                                </MotionBox>
                            ))}
                        </VStack>
                    ) : (
                        <Text textAlign="center">No work experience available.</Text>
                    )}
                </Box>

                <Box id="projects" mb={12} maxW="800px" mx="auto" color={fontColor}>
                    <Heading as="h2" size="lg" mb={6} textAlign="center" fontFamily="'Playfair Display', serif">
                        Projects
                    </Heading>
                    {portfolioData.projects && portfolioData.projects.length > 0 ? (
                        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" justifyContent="center" gap={6} color={fontColor} borderRadius="md">
                            {portfolioData.projects.map((project) => (
                                <MotionBox
                                    key={project.id}
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    width="100%"
                                    boxShadow="sm"
                                    whileHover={{ scale: 1.02, boxShadow: "lg" }}
                                    bgColor="gray.50"
                                >
                                    <Heading as="h3" size="md" mb={2} fontFamily="'Playfair Display', serif">
                                        {project.title}
                                    </Heading>
                                    <Text fontSize="sm">
                                        {project.description}
                                    </Text>
                                    <Text mt={2}>{project.technologies.join(', ')}</Text>
                                </MotionBox>
                            ))}
                        </Grid>
                    ) : (
                        <Text textAlign="center">No projects to display.</Text>
                    )}
                </Box>

                <Box id="contact" mb={12} maxW="800px" mx="auto" color={fontColor}>
                    <Heading as="h2" size="lg" mb={6} textAlign="center" fontFamily="'Playfair Display', serif">
                        Contact
                    </Heading>
                    <Flex direction="column" align="center">
                        <Text>
                            Email: <Link href={`mailto:${portfolioData.contacts.email}`} color={accentColor} _hover={{ textDecoration: "none", color: "gray.100" }}>{portfolioData.contacts.email}</Link>
                        </Text>
                        <Text>Phone: {portfolioData.contacts.phone}</Text>
                        {portfolioData.contacts.linkedIn && (
                            <Text>
                                LinkedIn: <Link href={portfolioData.contacts.linkedIn} isExternal color={accentColor}>{portfolioData.contacts.linkedIn}</Link>
                            </Text>
                        )}
                        {portfolioData.contacts.github && (
                            <Text>
                                GitHub: <Link href={portfolioData.contacts.github} isExternal color={accentColor}>{portfolioData.contacts.github}</Link>
                            </Text>
                        )}
                        {portfolioData.contacts.twitter && (
                            <Text>
                                Twitter: <Link href={portfolioData.contacts.twitter} isExternal color={accentColor}>{portfolioData.contacts.twitter}</Link>
                            </Text>
                        )}
                        <Button mt={4} colorScheme="teal" bgColor="gray.50" color={fontColor} border="1px solid #124E66" _hover={{ bgColor: "#124E66", color: "gray.50" }}>
                            Contact Me
                        </Button>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
}

export default MinimalisticTemplatePreview;