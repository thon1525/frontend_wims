import { HiMiniUsers, HiMiniCube } from "react-icons/hi2";
import { BiLineChart } from "react-icons/bi";
import { PiClockCounterClockwiseFill } from "react-icons/pi";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import Card from "../ui/Card"
import Dropdown from "../ui/Dropdown";
import DashboardStat from "../components/cards/DashboardStat";
import DashboardTable from "../components/DashboardTable";
import FeaturedProductImage from '../assets/images/products/product-10.jpg'
import AppleWatchImage from '../assets/images/products/product-9.jpg'
import PagesTitle from "../components/PagesTitle";
import SalesChart from "../components/charts/SalesChart";
import RevenueChart from "../components/charts/RevenueChart";
import SalesAnalyticsChart from "../components/charts/SalesAnalyticsChart";
import CustomersChart from "../components/charts/CustomersChart";
import axios from "axios";
import { useState,useEffect } from "react";

axios.defaults.withCredentials = true;
const dashboardData = [
  {
    stats: [
      {
        title: 'Total User',
        value: 40689,
        icon: {
          img: <HiMiniUsers />,
          bg: '#8280FF'
        },
        growth: {
          name: 'progress',
          rate: 8.5,
          time: 'yesterday'
        }
      },
      {
        title: 'Total Order',
        value: 10293,
        icon: {
          img: <HiMiniCube />,
          bg: '#FEC53D'
        },
        growth: {
          name: 'progress',
          rate: 1.3,
          time: 'pass week'
        }
      },
      {
        title: 'Total Sales',
        value: 89000,
        icon: {
          img: <BiLineChart />,
          bg: '#4AD991'
        },
        growth: {
          name: 'regress',
          rate: 4.3,
          time: 'yesterday'
        }
      },
      {
        title: 'Total Pending',
        value: 2040,
        icon: {
          img: <PiClockCounterClockwiseFill />,
          bg: '#FF9066'
        },
        growth: {
          name: 'progress',
          rate: 1.8,
          time: 'yesterday'
        }
      },
    ]
  },
  {
    products: [
      {
        image: AppleWatchImage,
        productName: 'apple watch',
        location: '6096 marjolaine landing',
        datetime: '12.09.2019 - 12.53 PM',
        piece: 423,
        amount: 34295,
        status: 'delivered'
      },
    ]
  },
]

const Dashboard = () => {
  const [protectedData, setProtectedData] = useState({
    username: "",
    email: '',
    full_name: '',
    id: '',
    is_superuser: false, 
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/user/");
      setProtectedData(response.data);
    } catch (error) {
      console.error("Error fetching protected data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PagesTitle />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-5">
        {dashboardData[0].stats.map((stat, index) => (
          <DashboardStat key={index} stat={stat} />
        ))}
      </div>

      <div className="mt-5">
        <SalesChart />
      </div>

      <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundColor: '#fff', marginTop: '20px' }}>
        <span className="flex items-center justify-between  mb-5">
          <h3 className="text-brand-primary-black text-[1.125rem] font-semibold">Deals Details</h3>
          <Dropdown />
        </span>
        <DashboardTable header={['image', 'product name', 'location', 'date - time', 'piece', 'amount', 'status']} data={dashboardData[1]?.products || []} />
      </Card>

      <div className="mt-5">
        <RevenueChart />
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        <CustomersChart />

        {protectedData?.id && (
          <div className="mt-5 p-3 border border-gray-300 rounded">
            <h2>Protected Data:</h2>
            <p><strong>ID:</strong> {protectedData.id}</p>
            <p><strong>Username:</strong> {protectedData.username}</p>
            <p><strong>Email:</strong> {protectedData.email}</p>
            <p><strong>Full Name:</strong> {protectedData.full_name}</p>
            <p><strong>Superuser:</strong>  {protectedData.is_superuser ? "Yes" : "No"}</p>
          </div>
        )}
      {loading && (
        <>
        sdfsfdsdf
        </>
      )}
        <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundColor: '#fff' }}>
          <h3 className="text-brand-primary-black text-[22px] font-semibold">Featured Product</h3>
          <span className="relative">
            <img src={FeaturedProductImage} alt="Feature Product" className="m-auto h-40" />
            <span className="absolute top-1/2 left-0 right-0 flex items-center justify-between transform -translate-y-1/2">
              <IoChevronBackOutline className="bg-[rgba(226,234,248,0.8)] text-[#626262] rounded-full p-2 h-8 w-8 flex items-center justify-center cursor-pointer" />
              <IoChevronForwardOutline className="bg-[rgba(226,234,248,0.8)] text-[#626262] rounded-full p-2 h-8 w-8 flex items-center justify-center cursor-pointer" />
            </span>
          </span>
          <span className="text-center mt-5">
            <p className="text-[#282D32] font-medium text-[1.125rem]">Sony 4k Screen</p>
            <p className="text-brand-primary-blue">$1750</p>
          </span>
        </Card>

        <SalesAnalyticsChart />
      </div>
    </>
  )
}

export default Dashboard