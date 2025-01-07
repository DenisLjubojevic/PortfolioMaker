import PropTypes from 'prop-types';

import { Button } from '@chakra-ui/react';

function ReviewStep({ previewUrl, onGeneratePreview, finalUrl }) {
    return (
        <div>

            {previewUrl ? (
                <div>
                    <p>Preview your portfolio here:</p>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                        {previewUrl}
                    </a>
                </div>
            ) : (
                    <Button
                        onClick={onGeneratePreview}
                    >
                        Generate Preview
                    </Button>
            )}

            {finalUrl && (
                <div>
                    <p>Your portfolio has been created! View it here:</p>
                    <a href={finalUrl} target="_blank" rel="noopener noreferrer">
                        {finalUrl}
                    </a>
                </div>
            )}
        </div>
    );
}

ReviewStep.propTypes = {
    data: PropTypes.object.isRequired,
    previewUrl: PropTypes.string,
    onGeneratePreview: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    finalUrl: PropTypes.string,
}

export default ReviewStep;
