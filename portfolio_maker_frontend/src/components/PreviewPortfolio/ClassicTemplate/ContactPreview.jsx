import PropTypes from 'prop-types';
import { Box, Button, Text, Link, useToast } from "@chakra-ui/react";

function ContactPreview({ data }) {
    const toast = useToast();

    const downloadCV = async () => {
        if (data.cvFileId && data.cvFileId != "No cv") {
            try {
                const response = await fetch(`https://localhost:7146/api/portfolio/cv/${data.cvFileId}`, {
                    method: "GET",
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "CV.pdf";
                    a.click();
                    window.URL.revokeObjectURL(url);
                } else {
                    const errorMessage = await response.json();
                    toast({
                        title: "Error downloading CV",
                        description: errorMessage.message || "Could not download the CV.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                toast({
                    title: "Error downloading CV",
                    description: error.message || "An unexpected error occurred.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    }

    return (
        <Box
            id="about"
            py={8}
            px={4}
            bg="gray.300"
            width="60%"
            height="80%"
            borderRadius="md"
            paddingTop="5rem"
            fontSize="2xl"
        >
            <Text fontSize="5xl" fontWeight="bold" mb={6}>
                Contact
            </Text>

            <Text>Email: <Link href={`mailto:${data.email}`} color="blue.500">{data.email}</Link></Text>

            <Text>Phone: {data.phone}</Text>

            {data.linkedIn && (
                <Text>
                    LinkedIn: <Link href={data.linkedIn} color="blue.500" isExternal>{data.linkedIn}</Link>
                </Text>
            )}

            {data.github && (
                <Text>
                    GitHub: <Link href={data.github} color="blue.500" isExternal>{data.github}</Link>
                </Text>
            )}

            {data.twitter && (
                <Text>
                    Twitter: <Link href={data.twitter} color="blue.500" isExternal>{data.twitter}</Link>
                </Text>
            )}

            {data.cvFileId && data.cvFileId !== "No cv" && (
                <Button mt={4} onClick={downloadCV} bg="brand.secondary.900" color="brand.primary.800">
                    Download CV
                </Button>
            )}
        </Box>
    );
}

ContactPreview.propTypes = {
    data: PropTypes.shape({
        email: PropTypes.string,
        phone: PropTypes.string,
        linkedIn: PropTypes.string,
        github: PropTypes.string,
        twitter: PropTypes.string,
        cvFileId: PropTypes.string,
    }).isRequired,
}

export default ContactPreview;