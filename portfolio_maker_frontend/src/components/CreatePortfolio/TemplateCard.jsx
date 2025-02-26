import { useState, useEffect } from 'react';
import { Image, Box, Text, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
function TemplateCard({ template, selectedTemplate, onSelect }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        let timer;
        if (isHovering && template.previewImages && template.previewImages.length > 1) {
            timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % template.previewImages.length);
            }, 1500);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isHovering, template.previewImages]);

    return (
        <Box
            borderWidth={selectedTemplate === template.templateId ? "3px" : "1px"}
            borderColor="brand.secondary.700"
            backgroundColor="brand.secondary.900"
            borderRadius="md"
            p={2}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                setCurrentIndex(0);
            }}
        >
            <Image
                src={
                    template.previewImages && template.previewImages.length > 0
                        ? "https://localhost:7146/api/portfolio/templatePicture/" + template.previewImages[currentIndex]
                        : "https://localhost:7146/api/portfolio/templatePicture/" + template.previewImage
                }
                alt={template.name}
                borderRadius="md"
            />
            <Text fontWeight="bold" mt={2}>{template.name}</Text>
            <Text fontSize="sm">{template.description}</Text>
            <Button mt={2} size="sm" onClick={() => onSelect(template.templateId)}>
                {selectedTemplate === template.templateId ? "Selected" : "Select"}
            </Button>
        </Box>
    );
}

TemplateCard.propTypes = {
    template: PropTypes.shape({
        templateId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        previewImage: PropTypes.string,
        previewImages: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    selectedTemplate: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default TemplateCard;