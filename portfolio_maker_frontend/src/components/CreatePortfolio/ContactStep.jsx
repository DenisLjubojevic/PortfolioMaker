import PropTypes from 'prop-types';

import {
    VStack,
    Flex,
    Input,
    Button,
    InputGroup,
    InputLeftElement,
} from '@chakra-ui/react';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';

function ContactStep({ data, setData }) {
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setData({ ...data, cv: file });
    };

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
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                    >
                        <FaEnvelope color="gray" />
                    </InputLeftElement>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={data.email || ''}
                        onChange={handleChange}
                        bg="brand.primary.800"
                        color="brand.secondary.900"
                        _placeholder={{
                            color: "brand.secondary.900",

                        }}
                        outline="0"
                        _focus={{
                            boxShadow: "none",
                            border: "2px solid",
                            borderColor: "brand.secondary.900",
                        }}
                    />
                </InputGroup>
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                    >
                        <FaPhone color="gray" />
                    </InputLeftElement>
                    <Input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={data.phone || ''}
                        onChange={handleChange}
                        bg="brand.primary.800"
                        color="brand.secondary.900"
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
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                    >
                        <FaLinkedin color="blue" />
                    </InputLeftElement>
                    <Input
                        type="url"
                        name="linkedin"
                        placeholder="LinkedIn URL"
                        value={data.linkedIn || ''}
                        onChange={handleChange}
                        bg="brand.primary.800"
                        color="brand.secondary.900"
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
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                    >
                        <FaGithub color="black" />
                    </InputLeftElement>
                    <Input
                        type="url"
                        name="github"
                        placeholder="GitHub URL"
                        value={data.github || ''}
                        onChange={handleChange}
                        bg="brand.primary.800"
                        color="brand.secondary.900"
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
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                    >
                        <FaTwitter color="#1DA1F2" />
                    </InputLeftElement>
                    <Input
                        type="url"
                        name="twitter"
                        placeholder="Twitter URL"
                        value={data.twitter || ''}
                        onChange={handleChange}
                        bg="brand.primary.800"
                        color="brand.secondary.900"
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

                <Button
                    as="label"
                    htmlFor="cv-upload"
                    bg="brand.primary.800"
                    color="brand.secondary.900"
                    _hover={{
                        bg: "brand.primary.700",
                    }}
                    padding="5px"
                    width="100%"
                    textAlign="center"
                >
                    {data.cv ? data.cv.name : "Upload CV"}
                    <Input
                        id="cv-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        name="cv"
                        onChange={handleFileUpload}
                        display="none"
                    />
                </Button>
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
        cv: PropTypes.object,
    }).isRequired,
    setData: PropTypes.func.isRequired,
}

export default ContactStep;
