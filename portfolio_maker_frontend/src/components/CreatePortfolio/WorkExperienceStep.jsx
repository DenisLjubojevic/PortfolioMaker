import { useState } from 'react';

import PropTypes from 'prop-types';

import {
    VStack,
    Flex,
    Input,
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
    Checkbox,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
function WorkExperienceStep({ data, setData }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [newExperience, setNewExperience] = useState({
        position: '',
        startedWorking: '',
        endedWorking: '',
        company: '',
        location: '',
        responsibilities: '',
        currentlyThere: false,
    });

    const handleAddWorkExperience = () => {
        const formatDate = (date) =>
            date ? `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}.` : '';

        setData([...data,
            {
                ...newExperience,
                startedWorking: formatDate(newExperience.startedWorking),
                endedWorking: newExperience.currentlyThere ? 'Present' : formatDate(newExperience.endedWorking),
                responsibilities: newExperience.responsibilities.split(',').map(resp => resp.trim())
            }]);

        setNewExperience({
            position: '',
            startedWorking: '',
            endedWorking: '',
            company: '',
            location: '',
            responsibilities: '',
            currentlyThere: false,
        });
        onClose();
    };

    const handleRemoveExperience = (index) => {
        const updatedExperiences = data.filter((_, i) => i !== index);
        setData(updatedExperiences);
    };

    const handleNewExperienceChange = (field, value) => {
        setNewExperience((prev) => ({ ...prev, [field]: value }));
    };

    const toggleCurrentlyThere = () => {
        setNewExperience((prev) => ({
            ...prev,
            currentlyThere: !prev.currentlyThere,
            endedWorking: prev.currentlyThere ? '' : 'Present',
        }));
    };

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
                <VStack align="start" width="100%" spacing={4} marginTop="10px">

                    {data.length > 0 ? (
                        <Box width="100%" textAlign="start">
                            <Text fontSize="lg">Your experience:</Text>
                        </Box>
                    ) : (
                        <Box width="100%" textAlign="center">
                            <Text>You do not have any working experience added!</Text>
                        </Box>
                    )}

                    {data.map((experience, index) => (
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
                                <Text fontWeight="bold" color="brand.primary.700">{experience.position || 'Experience position'}</Text>
                                <Text fontSize="sm" color="brand.primary.700">
                                    {experience.company}
                                </Text>
                            </Box>
                            <IconButton
                                aria-label="Remove Experience"
                                icon={<CloseIcon />}
                                size="sm"
                                bg="red.500"
                                color="white"
                                _hover={{ bg: 'red.600' }}
                                onClick={() => handleRemoveExperience(index)}
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
                    Add Experience
                </Button>
            </VStack>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg="brand.secondary.800" color="brand.primary.800">
                    <ModalHeader>
                        Add New Experience
                    </ModalHeader>
                    <ModalBody>
                        <VStack spacing={4}>
                            <Input
                                placeholder="Position"
                                value={newExperience.position}
                                onChange={(e) => handleNewExperienceChange('position', e.target.value)}
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
                            <HStack width="100%">
                                <Box width="50%" marginBottom="7%">
                                    <Text mb="8px"> Started Working: </Text>
                                    <DatePicker
                                        selected={newExperience.startedWorking ? new Date(newExperience.startedWorking) : null}
                                        onChange={(date) =>
                                            handleNewExperienceChange('startedWorking', date)}
                                        dateFormat="dd-MM-yyyy"
                                        placeholderText="Select start date"
                                        className="chakra-datepicker-input"
                                    />
                                    
                                </Box>
                                <Box width="50%">
                                    <Text mb="8px">Ended Working:</Text>
                                    <DatePicker
                                        selected={
                                            newExperience.endedWorking &&
                                                newExperience.endedWorking !== 'Present'
                                                ? new Date(newExperience.endedWorking)
                                                : null
                                        }
                                        onChange={(date) =>
                                            handleNewExperienceChange('endedWorking', date)
                                        }
                                        disabled={newExperience.currentlyThere}
                                        dateFormat="dd-MM-yyyy"
                                        placeholderText="Select end date"
                                        className="chakra-datepicker-input"
                                    />
                                    <Checkbox
                                        isChecked={newExperience.currentlyThere}
                                        onChange={toggleCurrentlyThere}
                                        mt="4px"
                                    >
                                        Currently There
                                    </Checkbox>
                                </Box>
                            </HStack>
                            <Input
                                placeholder="Company"
                                value={newExperience.company}
                                onChange={(e) => handleNewExperienceChange('company', e.target.value)}
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
                                placeholder="Location"
                                value={newExperience.location}
                                onChange={(e) => handleNewExperienceChange('location', e.target.value)}
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
                                placeholder="Responsibilities (comma-separated)"
                                value={newExperience.responsibilities}
                                onChange={(e) => handleNewExperienceChange('responsibilities', e.target.value)}
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
                            onClick={handleAddWorkExperience}
                        >
                            Complete
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

WorkExperienceStep.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            position: PropTypes.string,
            startedWorking: PropTypes.string,
            endedWorking: PropTypes.string,
            company: PropTypes.string,
            location: PropTypes.string,
        })
    ).isRequired,
    setData: PropTypes.func.isRequired,
}

export default WorkExperienceStep;