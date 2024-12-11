import PropTypes from 'prop-types';

function AboutStep({ data, setData }) {
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2>About Me</h2>
            <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={data.name || ''}
                onChange={handleChange}
            />
            <textarea
                name="bio"
                placeholder="Short Bio"
                value={data.bio || ''}
                onChange={handleChange}
            />
        </div>
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