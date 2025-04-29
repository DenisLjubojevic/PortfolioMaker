import * as PropTypes from 'prop-types';
import {
    HStack,
    IconButton,
    useColorModeValue,
} from '@chakra-ui/react';

import { FaStar } from "react-icons/fa";
import { useState } from 'react';

function StarRating({ rating, onChange }) {
    const activeColor = useColorModeValue('orange.400', 'orange.300');
    const inactiveColor = useColorModeValue('gray.300', 'gray.500');

    const [hovered, setHovered] = useState(0);

    return (
        <HStack spacing={1}>
            {Array(5).fill(0).map((_, idx) => {
                const val = idx + 1;
                const isFilled = val <= (hovered || rating);

                return (
                    <IconButton
                        key={val}
                        aria-label={`${val} star`}
                        icon={<FaStar />}
                        fontSize="1.5rem"
                        bg="transparent"
                        onClick={() => onChange(val)}
                        onMouseEnter={() => setHovered(val)}
                        onMouseLeave={() => setHovered(0)}
                        color={isFilled ? activeColor : inactiveColor}
                        _hover={{
                            color: activeColor,
                            border: "none",
                        }}
                    />
                );
            })}
        </HStack>
    )
}

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default StarRating;
