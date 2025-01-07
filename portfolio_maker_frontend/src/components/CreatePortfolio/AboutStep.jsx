import PropTypes from 'prop-types';

import {
    VStack,
    Flex,
    Input,
    Textarea,
} from '@chakra-ui/react';

function AboutStep({ data, setData }) {

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

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
                <Input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={data.name || ''}
                    onChange={handleChange}
                    bg='brand.primary.800'
                    color="brand.secondary.900"
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
                    name="bio"
                    placeholder="Short Bio"
                    value={data.bio || ''}
                    onChange={handleChange}
                    bg='brand.primary.800'
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
            </VStack>
        </Flex>
    );
}

AboutStep.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string,
        bio: PropTypes.string,
    }).isRequired,
    setData: PropTypes.func.isRequired,
};

export default AboutStep;