import * as PropTypes from 'prop-types';

function PortfolioList({ portfolios }) {
    return (
        <div>
            <h1>Portfolios</h1>
            {portfolios.length === 0 ? (
                <p>No portfolios found!</p>
            ) : (
                <ul>
                    {portfolios.map((portfolio) => (
                        <li key={portfolio.id}>
                            <h2>{portfolio.name}</h2>
                            <p>{portfolio.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

PortfolioList.propTypes = {
    portfolios: PropTypes.array.isRequired,
};

export default PortfolioList;