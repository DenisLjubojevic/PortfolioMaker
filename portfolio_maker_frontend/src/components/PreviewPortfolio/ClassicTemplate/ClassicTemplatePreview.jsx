import { useState } from 'react';


import PreviewNavbar from './PreviewNavbar';
import AboutSection from './AboutPreview';
import ExperienceSection from './ExperiencePreview';
import ProjectsSection from './ProjectsPreview';
import ContactSection from './ContactPreview';

import { Box, Flex } from "@chakra-ui/react";

function ClassicTemplatePreview({ portfolioData }) {
    const [activeSection, setActiveSection] = useState("about");

    return (
        <Flex
            width="100vw"
            height="100vh"
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

export default ClassicTemplatePreview;