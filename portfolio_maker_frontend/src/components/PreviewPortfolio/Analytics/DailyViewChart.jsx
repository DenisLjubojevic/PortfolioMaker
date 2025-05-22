import * as PropTypes from 'prop-types';

import dayjs from 'dayjs';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function DailyViewChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <XAxis
                    dataKey="date"
                    stroke="white"
                    tickFormatter={(date) => dayjs(date).format('DD-MM-YYYY')}
                />
                <YAxis
                    stroke="white"
                />
                <Tooltip
                    labelFormatter={(date) => dayjs(date).format('DD-MM-YYYY')}
                />
                <Line type="monotone" dataKey="views" stroke="black" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
}


export default DailyViewChart;