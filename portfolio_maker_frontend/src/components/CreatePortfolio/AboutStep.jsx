import PropTypes from 'prop-types';

import {
    VStack,
    HStack,
    IconButton,
    Flex,
    Input,
    Textarea,
    Text,
    Image
} from '@chakra-ui/react';

import { CloseIcon } from '@chakra-ui/icons'

function AboutStep({ data, setData, errors }) {

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleRemovePfp = () => {
        setData({ ...data, profilePictureId: "677fe3af776f9a7959c28928" });
    }

    return (
        <Flex
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
        >
            <VStack
                spacing={4}
                p="1rem"
            >
                <Flex flexDirection="column" marginTop="10px">
                    {(data.profilePictureId == "677fe3af776f9a7959c28928" || data.profilePictureId == null) ? (
                        <VStack>
                            <Text
                                ml={2}
                                color="brand.primary.700"
                                fontSize="lg"
                                fontWeight="bold"
                            >
                                Profile Picture
                            </Text>
                            <Input
                                width="420px"
                                padding="5px"
                                type="file"
                                name="profilePicture"
                                accept="image/*"
                                onChange={(e) => setData({ ...data, profilePictureId: e.target.files[0] })}
                                bg="brand.primary.800"
                                color="brand.secondary.900"
                                outline="0"
                                borderColor="brand.primary.900"
                                _placeholder={{
                                    color: "brand.secondary.900",
                                }}
                            />
                        </VStack>
                    ) : (
                        <HStack>
                            <Image
                                src={`https://localhost:7146/api/portfolio/profile-picture/${data.profilePictureId}`}
                                alt="Profile Picture"
                                boxSize={{ base: "50px", md: "50px" }}
                                borderRadius="full"
                            />
                            <IconButton
                                aria-label="Remove Picture"
                                icon={<CloseIcon />}
                                size="sm"
                                bg="red.500"
                                color="white"
                                _hover={{ bg: 'red.600' }}
                                onClick={() => handleRemovePfp()}
                            />
                        </HStack>
                    )
                    }
                </Flex>

                <Flex
                    position="relative"
                >
                    <Input
                        width="220px"
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={data.name || ''}
                        onChange={handleChange}
                        bg='brand.primary.800'
                        color="brand.secondary.900"
                        outline="0"
                        borderColor="brand.primary.900"
                        isInvalid={!!errors.name}
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
                    <Textarea
                        width="220px"
                        name="bio"
                        placeholder="Short Bio"
                        value={data.bio || ''}
                        onChange={handleChange}
                        borderColor="brand.primary.900"
                        bg='brand.primary.800'
                        color="brand.secondary.900"
                        isInvalid={!!errors.bio}
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
            </VStack>
        </Flex>
    );
}

AboutStep.propTypes = {
    data: PropTypes.shape({
        profilePictureId: PropTypes.string,
        name: PropTypes.string,
        bio: PropTypes.string,
    }).isRequired,
    setData: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
};

export default AboutStep;