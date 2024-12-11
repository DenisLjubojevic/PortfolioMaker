import PropTypes from 'prop-types';

function ReviewStep({ data, onSubmit }) {
    return (
        <div>
            <h2>Review Your Portfolio</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <button onClick={onSubmit}>Submit Portfolio</button>
        </div>
    );
}

ReviewStep.propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default ReviewStep;
