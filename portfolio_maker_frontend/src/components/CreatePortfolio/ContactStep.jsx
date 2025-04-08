import PropTypes from 'prop-types';

import {
    VStack,
    HStack,
    Flex,
    Text,
    Input,
    Button,
    InputGroup,
    InputLeftElement,
    IconButton,
} from '@chakra-ui/react';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';

import { useTheme } from "../../context/ThemeContext";

import { CloseIcon } from '@chakra-ui/icons'

function ContactStep({ data, setData, errors }) {
    const { theme } = useTheme();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setData({ ...data, cvFileId: file });
    };

    const handleRemoveCV = () => {
        setData({ ...data, cvFileId: "No cv" });
    }

    return (
        <Flex
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
            overflow="auto"
            padding="10px"
        >
            <VStack
                spacing={4}
                width="100%"
                height="100%"
            >
                <Flex
                    position="relative"
                >
                    <InputGroup
                        width="220px"
                    >
                        <InputLeftElement
                            pointerEvents="none"
                        >
                            <FaEnvelope color={theme == "light" ? "darkCyan" : "lightBlue"} />
                        </InputLeftElement>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={data.email || ''}
                            onChange={handleChange}
                            bg="brand.primary.800"
                            color="brand.secondary.900"
                            borderColor="brand.primary.900"
                            isInvalid={!!errors.email}
                            _placeholder={{
                                color: "brand.secondary.900",

                            }}
                            outline="0"
                            _focus={{
                                boxShadow: "none",
                                border: "2px solid",
                                borderColor: "brand.secondary.900",
                            }}
                            _invalid={{
                                borderColor: "red.500",
                                boxShadow: "0 0 0 1px red.500",
                            }}
                        />
                    </InputGroup>
                    <Text
                        ml={2}
                        color="brand.primary.700"
                        fontSize="lg"
                        fontWeight="bold"
                        title="This field is required!"
                    >
                        *
                    </Text>

                </Flex>
                
                <Flex
                    position="relative"
                >
                    <InputGroup
                        width="220px"
                    >
                        <InputLeftElement
                            pointerEvents="none"
                        >
                            <FaPhone color={theme == "light" ? "darkCyan" : "lightBlue"} />
                        </InputLeftElement>
                        <Input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={data.phone || ''}
                            onChange={handleChange}
                            bg="brand.primary.800"
                            color="brand.secondary.900"
                            borderColor="brand.primary.900"
                            isInvalid={!!errors.phone}
                            _placeholder={{
                                color: "brand.secondary.900",

                            }}
                            _focus={{
                                boxShadow: "none",
                                border: "2px solid",
                                borderColor: "brand.secondary.900",
                            }}
                            _invalid={{
                                borderColor: "red.500",
                                boxShadow: "0 0 0 1px red.500",
                            }}
                        />
                    </InputGroup>
                    <Text
                        ml={2}
                        color="brand.primary.700"
                        fontSize="lg"
                        fontWeight="bold"
                        title="This field is required!"
                    >
                        *
                    </Text>
                </Flex>
                

                <InputGroup
                    width="220px"
                    right="9px"
                >
                    <InputLeftElement
                        pointerEvents="none"
                    >
                        <FaLinkedin color={theme == "light" ? "blue" : "lightBlue"} />
                    </InputLeftElement>
                    <Input
                        type="url"
                        name="linkedin"
                        placeholder="Insert LinkedIn URL"
                        value={data.linkedIn || ''}
                        onChange={handleChange}
                        bg="brand.primary.800"
                        color="brand.secondary.900"
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
                </InputGroup>
                <InputGroup
                    width="220px"
                    right="9px"
                >
                    <InputLeftElement
                        pointerEvents="none"
                    >
                        <FaGithub color="black" />
                    </InputLeftElement>
                    <Input
                        type="url"
                        name="github"
                        placeholder="Insert GitHub URL"
                        value={data.github || ''}
                        onChange={handleChange}
                        bg="brand.primary.800"
                        color="brand.secondary.900"
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
                </InputGroup>
                <InputGroup
                    width="220px"
                    right="9px"
                >
                    <InputLeftElement
                        pointerEvents="none"
                    >
                        <FaTwitter color="#1DA1F2" />
                    </InputLeftElement>
                    <Input
                        type="url"
                        name="twitter"
                        placeholder="Insert Twitter URL"
                        value={data.twitter || ''}
                        onChange={handleChange}
                        bg="brand.primary.800"
                        color="brand.secondary.900"
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
                </InputGroup>

                {data.cvFileId == "No cv" ? (
                    <Button
                        width="300px"
                        as="label"
                        htmlFor="cv-upload"
                        bg="brand.primary.800"
                        color="brand.secondary.900"
                        _hover={{
                            bg: "brand.primary.700",
                        }}
                        padding="5px"
                        textAlign="center"
                    >
                        Upload CV
                        <Input
                            id="cv-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            name="cv"
                            onChange={handleFileUpload}
                            display="none"
                        />
                    </Button>
                ): (
                    <HStack>
                        <Text
                            ml={2}
                            color="brand.primary.700"
                            fontSize="lg"
                            fontWeight="bold"
                        >
                            You already have saved CV!
                        </Text>
                        <IconButton
                            aria-label="Remove CV"
                            icon={<CloseIcon />}
                            size="sm"
                            bg="red.500"
                            color="white"
                            _hover={{ bg: 'red.600' }}
                            onClick={() => handleRemoveCV()}
                        />
                    </HStack>
                ) }
            </VStack>
        </Flex>
    );
}

ContactStep.propTypes = {
    data: PropTypes.shape({
        email: PropTypes.string,
        phone: PropTypes.string,
        linkedIn: PropTypes.string,
        github: PropTypes.string,
        twitter: PropTypes.string,
        cvFileId: PropTypes.object,
    }).isRequired,
    setData: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
}

export default ContactStep;
