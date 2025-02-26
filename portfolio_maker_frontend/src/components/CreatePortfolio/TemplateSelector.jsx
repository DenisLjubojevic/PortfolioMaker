import { SimpleGrid } from '@chakra-ui/react';
import * as PropTypes from 'prop-types';

import TemplateCard from "./TemplateCard";

function TemplateSelector({ templates, selectedTemplate, onSelect }) {
  return (
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {templates.map((template) => (
              <TemplateCard
                  key={template.templateId}
                  template={template}
                  selectedTemplate={selectedTemplate}
                  onSelect={onSelect}
              />
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