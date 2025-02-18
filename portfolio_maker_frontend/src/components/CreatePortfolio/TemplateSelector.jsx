import { SimpleGrid, Image, Box, Text, Button } from '@chakra-ui/react';
import * as PropTypes from 'prop-types';

function TemplateSelector({ templates, selectedTemplate, onSelect }) {
  return (
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {templates.map((template) => (
              <Box
                  key={template.templateId}
                  borderWidth={selectedTemplate === template.templateId ? "3px" : "1px"}
                  borderColor="brand.secondary.700"
                  backgroundColor="brand.secondary.900"
                  borderRadius="md"
                  p={2}
              >
                  <Image
                      src={`https://localhost:7146/api/portfolio/templatePicture/${template.templateId}`}
                      alt={template.name}
                      borderRadius="md"
                  />
                  <Text fontWeight="bold" mt={2}>{template.name}</Text>
                  <Text fontSize="sm">{template.description}</Text>
                  <Button mt={2} size="sm" onClick={() => onSelect(template.templateId)}>
                      {selectedTemplate === template.templateId ? "Selected" : "Select"}
                  </Button>
              </Box>
          ))}
        
      </SimpleGrid>
  );
}

TemplateSelector.propTypes = {
    templates: PropTypes.array.isRequired,
    selectedTemplate: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
}

export default TemplateSelector;