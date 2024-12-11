import { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';

import PortfolioBuilder from './CreatePortfolio/PortfolioBuilder';
import PortfolioList from './PortfolioList';

function Dashboard({ token }) {
    const [portfolios, setPortfolios] = useState([]);
    const [creatingPortfolio, setCreatingPortfolio] = useState(false);

    const fetchPortfolios = async () => {
        try {
            const response = await axios.get('/api/portfolio', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPortfolios(response.data);
        } catch (error) {
            console.error('Failed to fetch portfolios:', error);
        }
    }

    useEffect(() => {
        fetchPortfolios();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {!creatingPortfolio ? (
                <>
                    <button onClick={() => setCreatingPortfolio(true)}>Create New Portfolio</button>
                    <PortfolioList portfolios={portfolios} />
                </>
            ) : (
                <PortfolioBuilder
                    onPortfolioCreated={() => {
                        fetchPortfolios();
                        setCreatingPortfolio(false);
                    }}
                />
            )}
        </div>
    );
}

Dashboard.propTypes = {
    token: PropTypes.string.isRequired,
};

export default Dashboard;
