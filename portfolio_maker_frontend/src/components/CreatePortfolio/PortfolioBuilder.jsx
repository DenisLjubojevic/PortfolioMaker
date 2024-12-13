import * as PropTypes from 'prop-types';
import { useState } from 'react';

import apiClient from '../../axiosConfig';

import AboutStep from './AboutStep';
import ProjectsStep from './ProjectsStep';
import ContactStep from './ContactStep';
import ReviewStep from './ReviewStep';

function PortfolioBuilder({ onPortfolioCreated }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [portfolioData, setPortfolioData] = useState({
        about: {},
        projects: [],
        contacts: {},
    });

    const handleSubmit = async () => {
        const payload = {
            name: portfolioData.about.name || "Unnamed Portfolio",
            description: portfolioData.about.bio || "No description provided.",
            bannerImageUrl: portfolioData.bannerImageUrl || "URL",
            isPublished: false,
            about: portfolioData.about,
            projects: portfolioData.projects,
            contacts: portfolioData.contacts,
            createdAt: new Date().toISOString(),
        };

        console.log(payload);
        if (!payload.projects || payload.projects.length === 0) {
            alert("You must add at least one project.");
            return;
        }

        try {
            const response = await apiClient.post('https://localhost:7146/api/portfolio/create', payload);
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
        { id: 1, label: 'About Me', component: <AboutStep data={portfolioData.about} setData={(data) => updateData('about', data)} /> },
        { id: 2, label: 'Projects', component: <ProjectsStep data={portfolioData.projects} setData={(data) => updateData('projects', data)} /> },
        { id: 3, label: 'Contact Info', component: <ContactStep data={portfolioData.contacts} setData={(data) => updateData('contacts', data)} /> },
        { id: 4, label: 'Review & Submit', component: <ReviewStep data={portfolioData} onSubmit={handleSubmit} /> },
    ];

    const updateData = (step, data) => {
        setPortfolioData((prevData) => ({
            ...prevData,
            [step]: data
        }));
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    }

    return (
        <div>
            <h1>Create Your Portfolio</h1>
            <div>
                {/* Progress Indicator */}
                <p>
                    Step {currentStep} of {steps.length}: {steps[currentStep - 1].label}
                </p>
                <div>
                    {/* Render Current Step */}
                    {steps[currentStep - 1].component}
                </div>
                {/* Navigation Controls */}
                <div>
                    <button onClick={handleBack} disabled={currentStep === 1}>
                        Back
                    </button>
                    {currentStep < steps.length ? (
                        <button onClick={handleNext}>Next</button>
                    ) : (
                        <button onClick={handleSubmit}>Submit</button>
                    )}
                </div>
            </div>
        </div>
    );
}

PortfolioBuilder.propTypes = {
    onPortfolioCreated: PropTypes.func,
}

export default PortfolioBuilder;