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
    useToast,
} from "@chakra-ui/react";
import { motion } from 'framer-motion';
import ProjectCard from "./ProjectCard";

const MotionBox = motion(Box);

function ModernTemplatePreview({ portfolioData }) {

    const bgColor = useColorModeValue('#EDE8F5', 'gray.800');
    const accentColor = useColorModeValue('#3D52A0', 'teal.300');

    const fontColor = "#3D52A0";
    const bannerUrl = "https://localhost:7146/api/portfolio/templatePicture/67b4bfccf97a09e418194e8b";

    const toast = useToast();

    const downloadCV = async () => {
        if (portfolioData.contacts.cvFileId && portfolioData.contacts.cvFileId != "No cv") {
            try {
                const response = await fetch(`https://localhost:7146/api/portfolio/cv/${portfolioData.contacts.cvFileId}`, {
                    method: "GET",
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "CV.pdf";
                    a.click();
                    window.URL.revokeObjectURL(url);
                } else {
                    const errorMessage = await response.json();
                    toast({
                        title: "Error downloading CV",
                        description: errorMessage.message || "Could not download the CV.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                toast({
                    title: "Error downloading CV",
                    description: error.message || "An unexpected error occurred.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    }

    return (
        <Flex direction="column" width="99vw" bg={bgColor} fontFamily="'Inter', sans-serif">
            <Box
                position="relative"
                height="60vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Image
                    src={bannerUrl}
                    borderRadius="md"
                    width="100%"
                    height="100%"
                />
                <Box position="absolute" top="0" left="0" right="0" bottom="0" bg="blackAlpha.200" />
                <VStack zIndex="1" spacing={4} position="absolute" left="20%">
                    <Heading as="h1" size="2xl" color="black">
                        {portfolioData.about.name}
                    </Heading>
                    <Text fontSize="xl" color="black">
                        {portfolioData.about.bio || "Passionate Developer & Designer"}
                    </Text>
                </VStack>
            </Box>

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
                    <Link
                        href="#about"
                        color={accentColor}
                        _hover={{
                            color: "#8697C4",
                        }}
                    >About</Link>
                    <Link
                        href="#experience"
                        color={accentColor}
                        _hover={{
                            color: "#8697C4",
                        }}
                    >Experience</Link>
                    <Link
                        href="#projects"
                        color={accentColor}
                        _hover={{
                            color: "#8697C4",
                        }}
                    >Projects</Link>
                    <Link
                        href="#contact"
                        color={accentColor}
                        _hover={{
                            color: "#8697C4",
                        }}
                    >Contact</Link>
                </HStack>
            </Flex>

            <Box px={8} py={12}>
                <Box id="about" mb={12} color={fontColor}>
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
                        <Heading as="h2" size="xl" mb={2} fontFamily="'Montserrat', sans-serif">
                            {portfolioData.about.name}
                        </Heading>
                        <Text fontSize="lg" textAlign="center" maxW="600px">
                            {portfolioData.about.bio}
                        </Text>
                    </Flex>
                </Box>

                <Box id="experience" mb={12} maxW="800px" mx="auto" color={fontColor}>
                    <Heading as="h2" size="lg" mb={6} textAlign="center" fontFamily="'Montserrat', sans-serif">
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
                                    bgColor="#ADBBDA"
                                >
                                    <Heading as="h3" size="md" mb={2} fontFamily="'Montserrat', sans-serif">
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
                    <Heading as="h2" size="lg" mb={6} textAlign="center" fontFamily="'Montserrat', sans-serif">
                        Projects
                    </Heading>
                    {portfolioData.projects && portfolioData.projects.length > 0 ? (
                        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} color={fontColor} bgColor="#ADBBDA" borderRadius="md">
                            {portfolioData.projects.map((project) => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </Grid>
                    ) : (
                        <Text textAlign="center">No projects to display.</Text>
                    )}
                </Box>

                <Box id="contact" mb={12} color={fontColor}>
                    <Heading as="h2" size="lg" mb={6} textAlign="center" fontFamily="'Montserrat', sans-serif">
                        Contact
                    </Heading>
                    <Flex direction="column" align="center">
                        <Text>
                            Email: <Link
                                        href={`mailto:${portfolioData.contacts.email}`}
                                        color={accentColor}

                                        _hover={{
                                            textDecoration: "none",
                                            color: "#8697C4",
                                        }}
                            >{portfolioData.contacts.email}</Link>
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
                        {portfolioData.contacts.cvFileId && portfolioData.contacts.cvFileId !== "No cv" && (
                            <Button
                                mt={4}
                                onClick={downloadCV}
                                bgColor="#ADBBDA"
                                color={accentColor}
                                border="1px solid #3D52A0"
                                _hover={{
                                    bg: "#3D52A0",
                                    color: "#EDE8F5",
                                    border: "none",
                                }}
                            >
                                Download CV
                            </Button>
                        )}
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
}

export default ModernTemplatePreview;