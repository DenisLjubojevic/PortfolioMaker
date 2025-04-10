import * as PropTypes from 'prop-types';
import { useState } from 'react';
import { useEffect } from "react";

import {
    Box,
    Text,
    Button,
    Flex,
    HStack,
    Step,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    StepDescription,
    Stepper,
    useToast
} from '@chakra-ui/react';

import apiClient from '../../axiosConfig';

import ExperienceStep from './WorkExperienceStep';
import AboutStep from './AboutStep';
import ProjectsStep from './ProjectsStep';
import ContactStep from './ContactStep';
import ReviewStep from './ReviewStep';

import { useTheme } from "../../context/ThemeContext";
function PortfolioBuilder({ onPortfolioCreated, initialData }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [portfolioData, setPortfolioData] = useState({
        about: {
            profilePictureId: null,
            name: '',
            bio: '',
        },
        experience: [],
        projects: [],
        contacts: {
            email: '',
            phone: '',
            linkedIn: '',
            github: '',
            twitter: '',
            cvFileId: "No cv",
        },
        previewUrl: null,
        userId: "",
        templateId: "67b36f341f501c852ab69bc8", //Id for default classic template
    });
    const [previewId, setPreviewId] = useState(null);
    const [finalUrl, setFinalUrl] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const { theme } = useTheme();
    const accentColor = theme === 'dark' ? '#276228' : '#c9dae7';

    const toast = useToast();

    const generatePreview = async () => {
        try {
            const payload = {
                name: portfolioData.about.name || "Unnamed Portfolio",
                description: portfolioData.about.bio || "No description provided.",
                bannerImageUrl: portfolioData.bannerImageUrl || "URL",
                isPublished: false,
                about: {
                    profilePictureId: portfolioData.about.profilePictureId || "677fe3af776f9a7959c28928", //Id for default profile picture
                    name: portfolioData.about.name,
                    bio: portfolioData.about.bio,
                },
                experience: portfolioData.experience,
                projects: portfolioData.projects,
                contacts: {
                    email: portfolioData.contacts.email,
                    phone: portfolioData.contacts.phone,
                    linkedin: portfolioData.contacts.linkedIn,
                    github: portfolioData.contacts.github,
                    twitter: portfolioData.contacts.twitter,
                    CVFileId: "No cv",
                },
                createdAt: new Date().toISOString(),
                portfolioUrl: "",
                userId: portfolioData.userId,
                templateId: portfolioData.templateId || "67b36f341f501c852ab69bc8",
            };

            for (const project of payload.projects) {
                if (project.imageId instanceof File) {
                    const formData = new FormData();
                    formData.append("projectImage", project.imageId);

                    try {
                        const response = await apiClient.post(`https://localhost:7146/api/portfolio/upload-project-image`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        project.imageId = response.data.fileId;
                    } catch (error) {
                        toast({
                            title: "Error uploading project image",
                            description: error.message || "An unexpected error occurred.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                } else {
                    project.imageId = "67f3ee10d86850c0a5aec7bd"; //default Id for placeholder
                }
            }

            const response = await apiClient.post('https://localhost:7146/api/portfolio/preview', {
                ...payload
            });
            setPreviewId(response.data.previewId);
            setPortfolioData((prevData) => ({
                ...prevData,
                previewUrl: `https://localhost:7146/api/portfolio/preview/${response.data.previewId}`,
            }));

            window.open(`/preview/${response.data.previewId}`, '_blank');
        } catch (error) {
            console.log('Failed to generate preview:', error);
        }
    }

    useEffect(() => {
        if (initialData) {
            setPortfolioData({
                ...initialData,
                projects: initialData.projects.map(project => ({
                    ...project,
                    isNew: false,
                })),
            });
        }
    }, [initialData]);

    const handleSubmit = async () => {

        const payload = {
            name: portfolioData.about.name || "Unnamed Portfolio",
            description: portfolioData.about.bio || "No description provided.",
            bannerImageUrl: portfolioData.bannerImageUrl || "URL",
            isPublished: false,
            about: {
                profilePictureId: portfolioData.about.profilePictureId || "677fe3af776f9a7959c28928", //Id for default profile picture
                name: portfolioData.about.name,
                bio: portfolioData.about.bio,
            },
            experience: portfolioData.experience,
            projects: portfolioData.projects,
            contacts: {
                email: portfolioData.contacts.email,
                phone: portfolioData.contacts.phone,
                linkedin: portfolioData.contacts.linkedIn,
                github: portfolioData.contacts.github,
                twitter: portfolioData.contacts.twitter,
                CVFileId: portfolioData.contacts.cvFileId,
            },
            createdAt: new Date().toISOString(),
            portfolioUrl: portfolioData.previewUrl,
            userId: portfolioData.userId,
            templateId: portfolioData.templateId || "67b36f341f501c852ab69bc8",
        };

        console.log(payload);

        let allErrors = {};
        steps.forEach((_, index) => {
            const stepErrors = validateStep(index);
            allErrors = { ...allErrors, ...stepErrors };
        });

        setValidationErrors(allErrors);

        if (Object.keys(allErrors).length === 0) {
            if (initialData) {
                if (portfolioData.about.profilePictureId !== initialData.about.profilePictureId) {
                    const formData = new FormData();
                    formData.append("profilePicture", portfolioData.about.profilePictureId);

                    try {
                        const response = await apiClient.post(`https://localhost:7146/api/portfolio/upload-profile-picture`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        payload.about.profilePictureId = response.data.fileId;
                    } catch (error) {
                        toast({
                            title: "Error uploading porfile picture",
                            description: error.message || "An unexpected error occurred.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                }

                if (portfolioData.contacts.cvFileId !== "No cv" && initialData.contacts.cvFileId === "No cv") {
                    const formData = new FormData();
                    formData.append('cvFile', portfolioData.contacts.cvFileId);

                    try {
                        const response = await apiClient.post(`https://localhost:7146/api/portfolio/upload-cv`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        payload.contacts.CVFileId = response.data.fileId;
                    } catch (error) {
                        toast({
                            title: "Error uploading CV",
                            description: error.message || "An unexpected error occurred.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                }

                try {
                    console.log(payload);
                    const response = await apiClient.put(`https://localhost:7146/api/portfolio/${initialData.id}`, payload);

                    if (previewId) {
                        await apiClient.delete(`https://localhost:7146/api/portfolio/preview/${previewId}`);
                    }

                    if (onPortfolioCreated) {
                        onPortfolioCreated(response.data);
                    }

                    toast({
                        title: "Portfolio edited",
                        description: "Portfolio edited successfully!",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } catch (error) {
                    toast({
                        title: "Error editing portfolio",
                        description: error.message || "An unexpected error occurred.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } else {
                if (portfolioData.about.profilePictureId) {
                    const formData = new FormData();
                    formData.append("profilePicture", portfolioData.about.profilePictureId);

                    try {
                        const response = await apiClient.post(`https://localhost:7146/api/portfolio/upload-profile-picture`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        payload.about.profilePictureId = response.data.fileId;
                    } catch (error) {
                        toast({
                            title: "Error uploading porfile picture",
                            description: error.message || "An unexpected error occurred.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                }

                if (portfolioData.contacts.cvFileId !== "No cv") {
                    const formData = new FormData();
                    formData.append('cvFile', portfolioData.contacts.cvFileId);

                    try {
                        const response = await apiClient.post(`https://localhost:7146/api/portfolio/upload-cv`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });
                        payload.contacts.CVFileId = response.data.fileId;
                    } catch (error) {
                        toast({
                            title: "Error uploading CV",
                            description: error.message || "An unexpected error occurred.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                }

                try {
                    const response = await apiClient.post('https://localhost:7146/api/portfolio/create', payload);
                    setFinalUrl(response.data.url);
                    const portfolioId = response.data.id;

                    for (const experience of portfolioData.experience) {
                        await apiClient.post(`https://localhost:7146/api/portfolio/${portfolioId}/experiences`, experience);
                    }

                    for (const project of portfolioData.projects) {
                        if (project.imageId !== null) {
                            const formData = new FormData();
                            formData.append("projectImage", project.imageId);

                            try {
                                const response = await apiClient.post(`https://localhost:7146/api/portfolio/upload-project-image`, formData, {
                                    headers: { 'Content-Type': 'multipart/form-data' },
                                });
                                project.imageId = response.data.fileId;
                            } catch (error) {
                                toast({
                                    title: "Error uploading project image",
                                    description: error.message || "An unexpected error occurred.",
                                    status: "error",
                                    duration: 5000,
                                    isClosable: true,
                                });
                            }
                        } else {
                            project.imageId = "67f3ee10d86850c0a5aec7bd"; // set id of image to placholder picture
                        }

                        await apiClient.post(`https://localhost:7146/api/portfolio/${portfolioId}/projects`, project);
                    }

                    if (previewId) {
                        await apiClient.delete(`https://localhost:7146/api/portfolio/preview/${previewId}`);
                    }

                    if (onPortfolioCreated) {
                        onPortfolioCreated(response.data);
                    }
                    toast({
                        title: "Portfolio created",
                        description: "Portfolio created successfully!",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                } catch (error) {
                    toast({
                        title: "Error creating portfolio",
                        description: error.message || "An unexpected error occurred.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            }
        } else {
            toast({
                title: "Validation error",
                description: "Please insert all requested informations!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    const steps = [
        {
            id: 1,
            label: 'About Me',
            description: 'Add deatils about you',
            component: <AboutStep data={portfolioData.about} setData={(data) => updateData('about', data)} errors={validationErrors} />
        },
        {
            id: 2,
            label: 'Experience',
            description: 'Add your work experience',
            component: <ExperienceStep data={portfolioData.experience} setData={(data) => updateData('experience', data)} />
        },
        {
            id: 3,
            label: 'Projects',
            description: 'Add your best projects',
            component: <ProjectsStep data={portfolioData.projects} setData={(data) => updateData('projects', data)} errors={validationErrors} />
        },
        {
            id: 4,
            label: 'Contact Info',
            description: 'Add info to reach you',
            component: <ContactStep data={portfolioData.contacts} setData={(data) => updateData('contacts', data)} errors={validationErrors} />
        },
        {
            id: 5,
            label: 'Review & Submit',
            description: 'Check if everything is right',
            component: <ReviewStep
                            templateId={portfolioData.templateId}
                            setData={(data) => updateData('templateId', data)}
                            previewUrl={portfolioData.previewUrl}
                            onGeneratePreview={generatePreview}
                            previewId={previewId}
            />
        },
    ];

    const validateStep = (step) => {
        const errors = {};
        if (step === 0) {
            if (!portfolioData.about.name) {
                errors.name = 'Name is required!';
            }
            if (!portfolioData.about.bio) {
                errors.bio = 'Bio is required!';
            }
        } else if (step === 2) {
            if (!portfolioData.projects || portfolioData.projects.length === 0) {
                errors.projects = 'At least one project is required.';
            }
        } else if (step === 3) {
            const { email, phone } = portfolioData.contacts;
            if (!email) {
                errors.email = 'Email is required.';
            }
            if (!phone) {
                errors.phone = 'Phone number is required.';
            }
        }

        return errors;
    }

    const updateData = (step, data) => {
        setPortfolioData((prevData) => ({
            ...prevData,
            [step]: data
        }));
        console.log(portfolioData);
    };

    const handleNext = () => {
        const errors = validateStep(currentStep);
        setValidationErrors(errors);

        if (Object.keys(errors).length === 0) {
            if (currentStep < steps.length - 1) {
                setCurrentStep((prev) => prev + 1);
            }
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    }

    return (
        <Flex
            flexDirection="column"
            width="100%"
            height="100%"
            borderRadius="10px"
            justifyContent="center"
            alignItems="center"
            bg="brand.primary.800"
        >
            <Box
                width="70%"
                height="95%"
                p={8}
                borderRadius="md"
                bg="brand.secondary.800"
                boxShadow="md"
            >
                <Text
                    fontSize="3xl"
                    mb={4}
                    color="brand.primary.800"
                    fontWeight="bold"
                >
                    Create Your Portfolio
                </Text>
                <Stepper
                    index={currentStep}
                    mb={6}
                    sx={{
                        "--stepper-accent-color": accentColor || "white",
                    }}
                >
                    {steps.map((step, index) => (
                        <Step key={index} display="flex" flexDirection="column" >
                            <StepIndicator bg={theme == "light" ? "brand.secondary.900" : "brand.secondary.900"} borderColor='brand.primary.800'>
                                <StepStatus
                                    complete={<StepIcon color={ theme == "light" ? "black" : "white" } />}
                                    incomplete={<StepNumber color="brand.primary.800"/>}
                                    active={<StepNumber color={theme == "light" ? "white" : "white"} />}
                                />
                            </StepIndicator>

                            <Box flexShrink='0'>
                                <StepTitle color="brand.primary.900">{step.label}</StepTitle>
                                <StepDescription fontSize="11px" color="brand.primary.700">{step.description}</StepDescription>
                            </Box>

                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>

                <Box mt={4} mb={8} height="10rem">
                    {steps[currentStep].component}
                </Box>

                <HStack justifyContent="space-between">
                    <Button
                        onClick={handleBack}
                        isDisabled={currentStep === 0}
                    >
                        Back
                    </Button>
                    {currentStep < steps.length - 1 ? (
                        <Button onClick={handleNext}>
                            Next
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit}>
                            Submit
                        </Button>
                    )}
                </HStack>
            </Box>
        </Flex>
    );
}

PortfolioBuilder.propTypes = {
    onPortfolioCreated: PropTypes.func,
    initialData: PropTypes.object,
}

export default PortfolioBuilder;