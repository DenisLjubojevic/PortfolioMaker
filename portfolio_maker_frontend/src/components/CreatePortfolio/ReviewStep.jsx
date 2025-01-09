import PropTypes from 'prop-types';

import {
    Button,
    Text,
    Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'

function ReviewStep({ previewUrl, onGeneratePreview, previewId }) {
    return (
        <div>

            {previewUrl ? (
                <div>
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
                    <Button
                        onClick={onGeneratePreview}
                    >
                        Generate Preview
                    </Button>
            )}
        </div>
    );
}

ReviewStep.propTypes = {
    previewUrl: PropTypes.string,
    onGeneratePreview: PropTypes.func.isRequired,
    previewId: PropTypes.string,
}

export default ReviewStep;
