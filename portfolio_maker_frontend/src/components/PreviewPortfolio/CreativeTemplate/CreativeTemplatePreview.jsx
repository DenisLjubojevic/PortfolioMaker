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
import ProjectCard from "../ModernTemplate/ProjectCard";

import { FiUser, FiBriefcase, FiFolder, FiMail } from "react-icons/fi";

const MotionBox = motion(Box);

function CreativeTemplatePreview({ portfolioData }) {
    const bgColor = useColorModeValue('#EEE2DC', 'gray.800');
    const accentColor = useColorModeValue('black', 'teal.300');

    const fontColor = "black";
    const bannerUrl = "https://localhost:7146/api/portfolio/templatePicture/67bf22289459976f91d4cd33";

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
        <Flex direction="column" width="99vw" bg={bgColor} fontFamily="'Lato', sans-serif">
            <Flex
                as="nav"
                p={4}
                position="absolute"
                top="0"
                zIndex="10"
                fontFamily="'Bebas Neue', sans-serif"
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

            <Box
                position="relative"
                height="60vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Image
                    src={bannerUrl}
                    width="100%"
                    height="100%"
                />
                <Box position="absolute" top="0" left="0" right="0" bottom="0" bg="blackAlpha.200" />
                <VStack zIndex="1" spacing={4} position="absolute" left="20%">
                    <Heading as="h1" size="4xl" color="black">
                        {portfolioData.about.name}
                    </Heading>
                    <Text fontSize="2xl" color="black">
                        {portfolioData.about.bio || "Passionate Developer & Designer"}
                    </Text>
                </VStack>
            </Box>

            <Box px={8} py={12}>
                <Box>                    
                    <Box id="about" mb={12} color={fontColor} float="left" width="70vw" bgColor="#28DEA5" padding="20px" borderRadius="md">
                        <Flex align="center" justify="space-between" direction="row">
                            {portfolioData.about.profilePictureId && (
                                <Image
                                    src={`https://localhost:7146/api/portfolio/profile-picture/${portfolioData.about.profilePictureId}`}
                                    alt="Profile"
                                    marginLeft="20px"
                                    width="20%"
                                    objectFit="cover"
                                    mb={4}
                                />
                            )}
                            <Box width="70%" textAlign="left" color="#17805F">
                                <Heading as="h1" size="2xl" mb={2} fontFamily="'Bebas Neue', sans-serif">
                                    {portfolioData.about.name}
                                </Heading>
                                <Text as="h2" fontSize="xl" marginLeft="20px">
                                    {portfolioData.about.bio}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>

                    <Box width="10%" float="left" mt={12} ml={6}>
                        <FiUser size="100%" color="black" />
                    </Box>
                </Box>

                <Box>
                    <Box id="experience" mb={12} mx="auto" color="#36CFFF" width="70vw" bgColor="#5348D2" padding="20px" borderRadius="md" float="right">
                        <Heading as="h2" size="lg" mb={6} textAlign="center" fontFamily="'Bebas Neue', sans-serif">
                            Work Experience
                        </Heading>
                        {portfolioData.experience && portfolioData.experience.length > 0 ? (
                            <VStack spacing={6}>
                                {portfolioData.experience.map((exp) => (
                                    <MotionBox
                                        key={exp.id}
                                        p={4}
                                        borderRadius="md"
                                        width="100%"
                                        maxW="800px"
                                        boxShadow="sm"
                                        whileHover={{ scale: 1.02, boxShadow: "lg" }}
                                        bgColor="#36CFFF"
                                        color="#5348D2"
                                    >
                                        <Heading as="h3" size="md" mb={2} fontFamily="'Bebas Neue', sans-serif">
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

                    <Box width="10%" float="right" mt={6} mr={6}>
                        <FiBriefcase size="100%" color="black" />
                    </Box>
                </Box>
                
                <Box>
                    <Box id="projects" mb={12} mx="auto" color="#82060B" float="left" width="70vw" bgColor="#F74C52" padding="20px" borderRadius="md">
                        <Heading as="h2" size="lg" mb={6} textAlign="center" fontFamily="'Bebas Neue', sans-serif">
                            Projects
                        </Heading>
                        {portfolioData.projects && portfolioData.projects.length > 0 ? (
                            <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} color="#F74C52" bgColor="#82060B" borderRadius="md">
                                {portfolioData.projects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </Grid>
                        ) : (
                            <Text textAlign="center">No projects to display.</Text>
                        )}
                    </Box>
                    <Box width="10%" float="left" mt={6} ml={6}>
                        <FiFolder size="100%" color="black" />
                    </Box>
                </Box>
                
                <Box>
                    <Box id="contact" mb={12} color="#B37B2D" float="right" width="70vw" bgColor="#FFCC4D" padding="20px" borderRadius="md">
                        <Heading as="h2" size="lg" mb={6} textAlign="center" fontFamily="'Bebas Neue', sans-serif">
                            Contact
                        </Heading>
                        <Flex direction="column" align="center" color="black">
                            <Text>
                                Email: <Link
                                    href={`mailto:${portfolioData.contacts.email}`}
                                    color="Blue"

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
                                    bgColor="#B37B2D"
                                    color="#FFCC4D"
                                    border="1px solid #FFCC4D"
                                    _hover={{
                                        bgColor: "#DEB143",
                                        color: "#B37B2D",
                                        border: "1px solid #B37B2D",
                                    }}
                                >
                                    Download CV
                                </Button>
                            )}
                        </Flex>
                    </Box>
                    <Box width="10%" float="right" mt={6} mr={6}>
                        <FiMail size="100%" color="black" />
                    </Box>
                </Box>
            </Box>
        </Flex>
    );
}

export default CreativeTemplatePreview;