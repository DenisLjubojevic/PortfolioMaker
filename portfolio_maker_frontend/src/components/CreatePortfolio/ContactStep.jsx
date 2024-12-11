import PropTypes from 'prop-types';

function ContactStep({ data, setData }) {
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2>Contact Info</h2>
            <input
                type="text"
                name="email"
                placeholder="Email"
                value={data.email || ''}
                onChange={handleChange}
            />
            <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={data.phone || ''}
                onChange={handleChange}
            />
        </div>
    );
}

ContactStep.propTypes = {
    data: PropTypes.shape({
        email: PropTypes.string,
        phone: PropTypes.string,
    }).isRequired,
    setData: PropTypes.func.isRequired,
}

export default ContactStep;
