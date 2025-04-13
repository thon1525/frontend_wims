/* eslint-disable react/prop-types */
import { IoIosTrendingDown, IoIosTrendingUp } from 'react-icons/io';
import Card from '../../ui/Card'

const DashboardStat = ({ stat }) => {
    return (
        <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundColor: '#fff' }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-brand-primary-black font-normal">{stat.title}</p>
                    <h3 className="text-brand-primary-black font-semibold text-[1.875rem] mt-3">{stat.title == 'Total Sales' && '$'}{stat.value.toLocaleString()}</h3>
                </div>
                <span
                    className={`text-[2rem] rounded-2xl p-2`}
                    style={{
                        backgroundColor: `${stat.icon.bg}30`,
                        color: stat.icon.bg,
                    }}
                >
                    {stat.icon.img}
                </span>
            </div>
            <div className="mt-5">
                <p className="flex items-center gap-2 text-[.8125rem]">
                    <span className={`flex items-center gap-2 ${stat.growth.name === 'progress' ? 'text-[#00B69B]' : 'text-[#F93C65]'}`}>
                        {stat.growth.name === 'progress' ? <IoIosTrendingUp /> : <IoIosTrendingDown />}
                        {stat.growth.rate}%
                    </span>
                    <span className="text-[#606060]">{stat.growth.name === 'progress' ? <span>Up</span> : <span>Down</span>} from {stat.growth.time}</span>
                </p>
            </div>
        </Card>
    );
};

export default DashboardStat;
