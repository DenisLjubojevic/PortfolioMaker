import { useState } from 'react';


import PreviewNavbar from '../ClassicTemplate/PreviewNavbar';
import AboutSection from '../ClassicTemplate/AboutPreview';
import ExperienceSection from '../ClassicTemplate/ExperiencePreview';
import ProjectsSection from '../ClassicTemplate/ProjectsPreview';
import ContactSection from '../ClassicTemplate/ContactPreview';

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

function ModernTemplatePreview({ portfolioData }) {
    const [activeSection, setActiveSection] = useState("about");

    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const accentColor = useColorModeValue('teal.500', 'teal.300');

    const fontColor = "gray.600";
    const bannerUrl = "https://localhost:7146/api/portfolio/templatePicture/67b4bfccf97a09e418194e8b";

    return (
        <Flex direction="column" width="100vw" bg={bgColor}>
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
            >
                <HStack spacing={8} mx="auto">
                    <Link href="#about" color={accentColor}>About</Link>
                    <Link href="#experience" color={accentColor}>Experience</Link>
                    <Link href="#projects" color={accentColor}>Projects</Link>
                    <Link href="#contact" color={accentColor}>Contact</Link>
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
                        <Heading as="h2" size="xl" mb={2}>
                            {portfolioData.about.name}
                        </Heading>
                        <Text fontSize="lg" textAlign="center" maxW="600px">
                            {portfolioData.about.bio}
                        </Text>
                    </Flex>
                </Box>

                <Box id="experience" mb={12} color={fontColor}>
                    <Heading as="h2" size="lg" mb={6} textAlign="center">
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
                                    bgColor="gray.200"
                                >
                                    <Heading as="h3" size="md" mb={2}>
                                        {exp.position} at {exp.company}
                                    </Heading>
                                    <Text fontSize="sm" color="gray.600">
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

                <Box id="projects" mb={12} color={fontColor}>
                    <Heading as="h2" size="lg" mb={6} textAlign="center">
                        Projects
                    </Heading>
                    {portfolioData.projects && portfolioData.projects.length > 0 ? (
                        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} color={fontColor}>
                            {portfolioData.projects.map((proj) => (
                                <MotionBox
                                    key={proj.id}
                                    p={4}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    boxShadow="sm"
                                    whileHover={{ scale: 1.02, boxShadow: "lg" }}
                                    bgColor="gray.200"
                                >
                                    <Heading as="h3" size="md" mb={2}>
                                        {proj.title}
                                    </Heading>
                                    <Text mb={2}>{proj.description}</Text>
                                    <HStack spacing={4}>
                                        <Link href={proj.demoUrl} isExternal color={accentColor}>
                                            Demo
                                        </Link>
                                        <Link href={proj.repoUrl} isExternal color={accentColor}>
                                            Repo
                                        </Link>
                                    </HStack>
                                </MotionBox>
                            ))}
                        </Grid>
                    ) : (
                        <Text textAlign="center">No projects to display.</Text>
                    )}
                </Box>

                {/* Contact Section */}
                <Box id="contact" mb={12} color={fontColor}>
                    <Heading as="h2" size="lg" mb={6} textAlign="center">
                        Contact
                    </Heading>
                    <Flex direction="column" align="center">
                        <Text>
                            Email: <Link href={`mailto:${portfolioData.contacts.email}`} color={accentColor}>{portfolioData.contacts.email}</Link>
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
                        <Button mt={4} colorScheme="teal">
                            Contact Me
                        </Button>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
}

export default ModernTemplatePreview;