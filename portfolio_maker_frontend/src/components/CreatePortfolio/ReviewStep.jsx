import PropTypes from 'prop-types';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Button,
    Text,
    Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'
import TemplateSelector from './TemplateSelector';

function ReviewStep({ templateId, setData, previewUrl, onGeneratePreview, previewId }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onTemplateSelect = (selectedTemplateId) => {
        setData(selectedTemplateId);
    };

    const templates = [
        {
            "templateId": "67b36f341f501c852ab69bc8",
            "name": "Classic",
            "description": "A clean, minimal layout.",
        },
        {
            "templateId": "67b4c45ef97a09e418194e93",
            "name": "Modern",
            "description": "A vibrant, contemporary design.",
        }
    ];

    return (
        <div>
            <Button
                onClick={onOpen}
                bg="brand.primary.800"
                color="brand.secondary.900"
                _hover={{
                    bg: "brand.primary.900",
                    border: "2px solid",
                    borderColor: "brand.secondary.900",
                }}>
                Change template
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    bg="brand.secondary.800"
                    color="brand.primary.800"
                    maxWidth="90vw"
                    height="90vh"
                >
                    <ModalHeader>
                        Change style of your portfolio
                    </ModalHeader>
                    <ModalBody>
                        <TemplateSelector templates={templates} selectedTemplate={templateId} onSelect={onTemplateSelect}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            

            {previewUrl ? (
                <div>
                    <br />
                    <Text
                        ml={2}
                        color="brand.primary.900"
                        fontSize="lg"
                        fontWeight="bold"
                    >
                        Preview your portfolio here:
                    </Text>
                    <ChakraLink as={ReactRouterLink} color="brand.primary.900" target="_blank" to={`/preview/${previewId}`}>
                        {previewUrl}
                    </ChakraLink>
                </div>
            ) : (
                <div>
                    <br/>
                    <Button
                        onClick={onGeneratePreview}
                    >
                        Generate Preview
                    </Button>
                </div>
            )}
        </div>
    );
}

ReviewStep.propTypes = {
    templateId: PropTypes.string,
    setData: PropTypes.func.isRequired,
    previewUrl: PropTypes.string,
    onGeneratePreview: PropTypes.func.isRequired,
    previewId: PropTypes.string,
}

export default ReviewStep;
