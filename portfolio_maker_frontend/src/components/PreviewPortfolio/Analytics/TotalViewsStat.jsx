import * as PropTypes from 'prop-types';

import { Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';

function TotalViewsStat({ totalViews }) {
    return (
        <Stat>
            <StatLabel>Total views (30d)</StatLabel>
            <StatNumber>{totalViews ?? "-"}</StatNumber>
            <StatHelpText>Last 30 days</StatHelpText>
        </Stat>
    );
}


export default TotalViewsStat;