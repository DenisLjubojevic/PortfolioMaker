import PropTypes from 'prop-types';
import { Box, Text, Link } from "@chakra-ui/react";

function ContactPreview({ data }) {
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
            <Text>LinkedIn: <Link href={data.linkedIn} color="blue.500" isExternal>{data.linkedIn}</Link></Text>
            <Text>GitHub: <Link href={data.github} color="blue.500" isExternal>{data.github}</Link></Text>
            <Text>Twitter: <Link href={data.twitter} color="blue.500" isExternal>{data.twitter}</Link></Text>
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
        cv: PropTypes.object,
    }).isRequired,
}

export default ContactPreview;