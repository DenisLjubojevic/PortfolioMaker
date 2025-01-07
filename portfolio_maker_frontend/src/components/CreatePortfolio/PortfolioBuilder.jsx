import * as PropTypes from 'prop-types';
import { useState } from 'react';

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
    Stepper
} from '@chakra-ui/react';

import apiClient from '../../axiosConfig';

import AboutStep from './AboutStep';
import ProjectsStep from './ProjectsStep';
import ContactStep from './ContactStep';
import ReviewStep from './ReviewStep';

function PortfolioBuilder({ onPortfolioCreated }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [portfolioData, setPortfolioData] = useState({
        about: {},
        projects: [],
        contacts: {
            email: '',
            phone: '',
            linkedin: '',
            github: '',
            twitter: '',
            cv: null,
        },
        previewUrl: null,
    });
    const [previewId, setPreviewId] = useState(null);
    const [finalUrl, setFinalUrl] = useState(null);

    const generatePreview = async () => {
        try {
            const payload = {
                name: portfolioData.about.name || "Unnamed Portfolio",
                description: portfolioData.about.bio || "No description provided.",
                bannerImageUrl: portfolioData.bannerImageUrl || "URL",
                isPublished: false,
                about: portfolioData.about,
                projects: portfolioData.projects,
                contacts: {
                    email: portfolioData.contacts.email,
                    phone: portfolioData.contacts.phone,
                    linkedin: portfolioData.contacts.linkedin,
                    github: portfolioData.contacts.github,
                    twitter: portfolioData.contacts.twitter,
                    cvfileid: "No cv",
                },
                createdAt: new Date().toISOString(),
                portfolioUrl: "",
            };

            const response = await apiClient.post('https://localhost:7146/api/portfolio/preview', {
                ...payload
            });
            setPreviewId(response.data.previewId);
            setPortfolioData((prevData) => ({
                ...prevData,
                previewUrl: `https://localhost:7146/api/portfolio/preview/${previewId}`,
            }));

            window.open(`/preview/${previewId}`, '_blank');
        } catch (error) {
            console.log('Failed to generate preview:', error);
        }
    }

    const handleSubmit = async () => {
        if (previewId) {
            await apiClient.delete(`https://localhost:7146/api/portfolio/preview/${previewId}`);
        }

        const payload = {
            name: portfolioData.about.name || "Unnamed Portfolio",
            description: portfolioData.about.bio || "No description provided.",
            bannerImageUrl: portfolioData.bannerImageUrl || "URL",
            isPublished: false,
            about: portfolioData.about,
            projects: portfolioData.projects,
            contacts: {
                email: portfolioData.contacts.email,
                phone: portfolioData.contacts.phone,
                linkedin: portfolioData.contacts.linkedin,
                github: portfolioData.contacts.github,
                twitter: portfolioData.contacts.twitter,
                cvfileid: "No cv",
            },
            createdAt: new Date().toISOString(),
            portfolioUrl: `https://localhost:7146/api/portfolio/preview/${previewId}`,
        };

        if (portfolioData.contacts.cv) {
            const formData = new FormData();
            formData.append('cv', portfolioData.contacts.cv);

            try {
                const response = await apiClient.post(`https://localhost:7146/api/portfolio/upload-cv`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                payload.contacts.cv = response.data.fileId;
            } catch (error) {
                console.error('Failed to upload CV:', error.response.data.errors);
            }
        }

        console.log(payload);
        if (!payload.projects || payload.projects.length === 0) {
            alert("You must add at least one project.");
            return;
        }

        try {
            const response = await apiClient.post('https://localhost:7146/api/portfolio/create', payload);
            setFinalUrl(response.data.url);
            const portfolioId = response.data.id;

            for (const project of portfolioData.projects) {
                const projectPayload = {
                    ...project,
                    portfolioId: portfolioId,
                };

                await apiClient.post(`https://localhost:7146/api/portfolio/${portfolioId}/projects`, projectPayload);
            }

            if (onPortfolioCreated) {
                onPortfolioCreated(response.data);
            }
            alert('Portfolio created successfully!');
        } catch (error) {
            console.error('Failed to create portfolio:', error.response.data.errors);
            alert('Error creating portfolio. Please try again.');
        }
    }

    const steps = [
        {
            id: 1,
            label: 'About Me',
            description: 'Add deatils about you',
            component: <AboutStep data={portfolioData.about} setData={(data) => updateData('about', data)} />
        },
        {
            id: 2,
            label: 'Projects',
            description: 'Add your best projects',
            component: <ProjectsStep data={portfolioData.projects} setData={(data) => updateData('projects', data)} />
        },
        {
            id: 3,
            label: 'Contact Info',
            description: 'Add info to reach you',
            component: <ContactStep data={portfolioData.contacts} setData={(data) => updateData('contacts', data)} />
        },
        {
            id: 4,
            label: 'Review & Submit',
            description: 'Check if everything is right',
            component: <ReviewStep
                            previewUrl={portfolioData.previewUrl}
                            onGeneratePreview={generatePreview}
                            finalUrl={finalUrl}
            />
        },
    ];

    const updateData = (step, data) => {
        setPortfolioData((prevData) => ({
            ...prevData,
            [step]: data
        }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
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
                >
                    {steps.map((step, index) => (
                        <Step key={index} display="flex" flexDirection="column" >
                            <StepIndicator bg="brand.primary.700">
                                <StepStatus
                                    complete={<StepIcon color="black"/>}
                                    incomplete={<StepNumber color="brand.secondary.900"/>}
                                    active={<StepNumber color="brand.secondary.900"/>}
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

                <Box mt={4} mb={8} height="12rem">
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
}

export default PortfolioBuilder;