import PropTypes from 'prop-types';

import {
    VStack,
    Flex,
    Input,
    Textarea,
    Button,
    Box,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Text,
    IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { CloseIcon } from '@chakra-ui/icons'

function ProjectsStep({ data, setData, errors }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newProject, setNewProject] = useState({
        imageId: null,
        title: '',
        description: '',
        technologies: '',
        demoUrl: '',
        repoUrl: '',
        isNew: true,
    });

    const handleAddProject = () => {
        setData([...data, { ...newProject, technologies: newProject.technologies.split(',').map((tech) => tech.trim()) }]);
        setNewProject({ title: '', description: '', technologies: '', demoUrl: '', repoUrl: '' });
        onClose();
    };

    const handleRemoveProject = (index) => {
        const updatedProjects = data.filter((_, i) => i !== index);
        setData(updatedProjects);
    };

    const handleNewProjectChange = (field, value) => {
        setNewProject((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        console.log("Setting image - ");
        console.log(file);
        newProject.imageId = file;
    }

    return (
        <Flex
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
            overflow="auto"
        >
            <VStack
                spacing={4}
                p="1rem"
                width="80%"
            >
                <VStack align="start" width="100%" spacing={4}>
                    {data.map((project, index) => (
                        <HStack
                            key={index}
                            bg="brand.secondary.700"
                            p={4}
                            borderRadius="md"
                            boxShadow="sm"
                            width="100%"
                            justifyContent="space-between"
                        >
                            <Box>
                                <Text fontWeight="bold" color="brand.primary.700">{project.title || 'Untitled Project'}</Text>
                                <Text fontSize="sm" color="brand.primary.700">
                                    {project.technologies.join(', ')}
                                </Text>
                            </Box>
                            <IconButton
                                aria-label="Remove Project"
                                icon={<CloseIcon />}
                                size="sm"
                                bg="red.500"
                                color="white"
                                _hover={{ bg: 'red.600' }}
                                onClick={() => handleRemoveProject(index)}
                            />
                        </HStack>
                    ))}
                </VStack>
                <Button
                    onClick={onOpen}
                    bg="brand.primary.800"
                    color="brand.secondary.900"
                    _hover={{
                        bg: "brand.primary.900",
                        border: "2px solid",
                        borderColor: "brand.secondary.900",
                    }}>
                    Add Project
                </Button>
                {errors.projects && <Text color="red.500" bg="gray.300" padding="5px" borderRadius="10px" fontSize="sm">{errors.projects}</Text>}
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg="brand.secondary.800" color="brand.primary.800">
                    <ModalHeader>
                        Add New Project
                    </ModalHeader>
                    <ModalBody>
                        <VStack spacing={4}>
                            <HStack>
                                <Input
                                    width="400px"
                                    padding="5px"
                                    type="file"
                                    name="projectImage"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    bg="brand.primary.800"
                                    color="brand.secondary.900"
                                    outline="0"
                                    borderColor="brand.primary.900"
                                    _placeholder={{
                                        color: "brand.secondary.900",
                                    }}
                                />
                            </HStack>

                            <Input
                                placeholder="Project Title"
                                value={newProject.title}
                                onChange={(e) => handleNewProjectChange('title', e.target.value)}
                                bg='brand.primary.800'
                                color="brand.secondary.800"
                                borderColor="brand.primary.900"
                                outline="0"
                                _placeholder={{
                                    color: "brand.secondary.900",

                                }}
                                _focus={{
                                    boxShadow: "none",
                                    border: "2px solid",
                                    borderColor: "brand.secondary.900",
                                }}
                            />
                            <Textarea
                                placeholder="Project Description"
                                value={newProject.description}
                                onChange={(e) => handleNewProjectChange('description', e.target.value)}
                                bg='brand.primary.800'
                                color="brand.secondary.800"
                                borderColor="brand.primary.900"
                                _placeholder={{
                                    color: "brand.secondary.900",

                                }}
                                _focus={{
                                    boxShadow: "none",
                                    border: "2px solid",
                                    borderColor: "brand.secondary.900",
                                }}
                            />
                            <Input
                                placeholder="Technologies (comma-separated)"
                                value={newProject.technologies}
                                onChange={(e) => handleNewProjectChange('technologies', e.target.value)}
                                bg='brand.primary.800'
                                color="brand.secondary.800"
                                borderColor="brand.primary.900"
                                outline="0"
                                _placeholder={{
                                    color: "brand.secondary.900",

                                }}
                                _focus={{
                                    boxShadow: "none",
                                    border: "2px solid",
                                    borderColor: "brand.secondary.900",
                                }}
                            />
                            <Input
                                placeholder="Demo URL"
                                value={newProject.demoUrl}
                                onChange={(e) => handleNewProjectChange('demoUrl', e.target.value)}
                                bg='brand.primary.800'
                                color="brand.secondary.800"
                                borderColor="brand.primary.900"
                                outline="0"
                                _placeholder={{
                                    color: "brand.secondary.900",

                                }}
                                _focus={{
                                    boxShadow: "none",
                                    border: "2px solid",
                                    borderColor: "brand.secondary.900",
                                }}
                            />
                            <Input
                                placeholder="Repo URL"
                                value={newProject.repoUrl}
                                onChange={(e) => handleNewProjectChange('repoUrl', e.target.value)}
                                bg='brand.primary.800'
                                color="brand.secondary.800"
                                borderColor="brand.primary.900"
                                outline="0"
                                _placeholder={{
                                    color: "brand.secondary.900",

                                }}
                                _focus={{
                                    boxShadow: "none",
                                    border: "2px solid",
                                    borderColor: "brand.secondary.900",
                                }}
                            />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={onClose}
                            mr={3}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddProject}  
                        >
                            Complete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    ); 
}

ProjectsStep.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            imageId: PropTypes.object,
            title: PropTypes.string,
            description: PropTypes.string,
            demoUrl: PropTypes.string,
            repoUrl: PropTypes.string,
        })
    ).isRequired,
    setData: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
}

export default ProjectsStep;