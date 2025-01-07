import PropTypes from 'prop-types';

import {
    Button,
    Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom'

function ReviewStep({ previewUrl, onGeneratePreview, previewId }) {
    return (
        <div>

            {previewUrl ? (
                <div>
                    <p>Preview your portfolio here:</p>
                    <ChakraLink as={ReactRouterLink} target="_blank" to={`/preview/${previewId}`}>
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
    data: PropTypes.object.isRequired,
    previewUrl: PropTypes.string,
    onGeneratePreview: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    previewId: PropTypes.string,
}

export default ReviewStep;
