import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../axiosConfig';

import PreviewNavbar from './PreviewNavbar';
import AboutSection from './AboutPreview';
import ExperienceSection from './ExperiencePreview';
import ProjectsSection from './ProjectsPreview';
import ContactSection from './ContactPreview';

import { Box, Flex } from "@chakra-ui/react";

function PortfolioPreview() {
    const { previewId } = useParams();
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("about");

    useEffect(() => {
        async function fetchPreviewData() {
            try {
                const response = await apiClient.get(`https://localhost:7146/api/portfolio/preview/${previewId}`);
                setPortfolioData(response.data);
            } catch (error) {
                console.error('Failed to fetch preview data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPreviewData();
    }, [previewId]);


    if (loading) return <p>Loading preview...</p>;
    if (!portfolioData) return <p>Preview not found!</p>;

    return (
        <Flex
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            bg="gray.600"
        >
            <Box
                width="100%"
            >
                <PreviewNavbar onNavigate={setActiveSection} />                
            </Box>
            <Box
                width="100%"
                height="92vh"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="brand.secondary.900"
            >
                {activeSection === "about" && <AboutSection data={portfolioData.about} />}
                {activeSection === "experience" && (
                    <ExperienceSection data={portfolioData.experience} />
                )}
                {activeSection === "projects" && (
                    <ProjectsSection data={portfolioData.projects} />
                )}
                {activeSection === "contact" && (
                    <ContactSection data={portfolioData.contacts} />
                )}
            </Box>
        </Flex>
    );
}

export default PortfolioPreview;