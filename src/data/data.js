import { BiLineChart } from "react-icons/bi";
import { HiMiniCube, HiMiniUsers } from "react-icons/hi2";
import { PiClockCounterClockwiseFill } from "react-icons/pi";
import AppleWatchImage from '../assets/images/products/product-9.jpg'
import FeaturedProductImage from '../assets/images/products/product-10.jpg'

export const statsData = [
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

export const salesData = [
  { sales: '5k', percentage: 20 },
  { sales: '10k', percentage: 40 },
  { sales: '15k', percentage: 45 },
  { sales: '20k', percentage: 64 },
  { sales: '25k', percentage: 50 },
  { sales: '30k', percentage: 40 },
  { sales: '35k', percentage: 30 },
  { sales: '40k', percentage: 50 },
  { sales: '45k', percentage: 55 },
  { sales: '50k', percentage: 45 },
  { sales: '55k', percentage: 50 },
  { sales: '60k', percentage: 60 },
];

export const dashboardProductData = [
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

export const revenueData = [
  { week: '5k', sales: 30, profit: 20 },
  { week: '10k', sales: 60, profit: 50 },
  { week: '15k', sales: 40, profit: 30 },
  { week: '20k', sales: 70, profit: 40 },
  { week: '25k', sales: 50, profit: 20 },
  { week: '30k', sales: 80, profit: 40 },
  { week: '35k', sales: 60, profit: 60 },
  { week: '40k', sales: 100, profit: 70 },
  { week: '45k', sales: 70, profit: 50 },
  { week: '50k', sales: 90, profit: 60 },
  { week: '55k', sales: 60, profit: 80 },
  { week: '60k', sales: 100, profit: 90 },
];

export const featuredProductData = {
  image: FeaturedProductImage,
  name: 'sony 4k screen',
  price: 1750
}

export const initialEmailData = [
  {
    id: 1,
    sender: "Jullu Jalal",
    subject: "Our Bachelor of Commerce program is ACBSP-accredited.",
    time: "8:38 AM",
    label: "Primary",
    starred: false,
    folder: "inbox",
  },
  {
    id: 2,
    sender: "Minerva Barnett",
    subject: "Get Best Advertiser In Your Side Pocket",
    time: "8:13 AM",
    label: "Work",
    starred: false,
    folder: "inbox",
  },
  {
    id: 3,
    sender: "Peter Lewis",
    subject: "Vacation Home Rental Success",
    time: "7:52 PM",
    label: "Friends",
    starred: false,
    folder: "inbox",
  },
  {
    id: 4,
    sender: "Anthony Briggs",
    subject: "Free Classifieds Using Them To Promote Your Stuff Online",
    time: "7:52 PM",
    label: "",
    starred: true,
    folder: "inbox",
  },
  {
    id: 5,
    sender: "Clifford Morgan",
    subject: "Enhance Your Brand Potential With Giant Advertising Blimps",
    time: "4:13 PM",
    label: "Social",
    starred: false,
    folder: "inbox",
  },
  {
    id: 6,
    sender: "Lora Houston",
    subject: "Vacation Home Rental Success",
    time: "7:52 PM",
    label: "Friends",
    starred: false,
    folder: "inbox",
  },
  {
    id: 7,
    sender: "Olga Hogan",
    subject: "Enhance Your Brand Potential With Giant Advertising Blimps",
    time: "4:13 PM",
    label: "Social",
    starred: false,
    folder: "inbox",
  },
  {
    id: 8,
    sender: "Fanny Weaver",
    subject: "Free Classifieds Using Them To Promote Your Stuff Online",
    time: "7:52 PM",
    label: "",
    starred: true,
    folder: "inbox",
  },
  {
    id: 9,
    sender: "Jared Dunn",
    subject: "Project Update: Q2 Goals",
    time: "2:30 PM",
    label: "Work",
    starred: false,
    folder: "inbox",
  },
  {
    id: 10,
    sender: "Monica Hall",
    subject: "Team Building Event Next Month",
    time: "11:15 AM",
    label: "Social",
    starred: false,
    folder: "inbox",
  },
  {
    id: 11,
    sender: "Richard Hendricks",
    subject: "New Algorithm Breakthrough",
    time: "9:45 AM",
    label: "Work",
    starred: true,
    folder: "inbox",
  },
  {
    id: 12,
    sender: "Erlich Bachman",
    subject: "Pitch Deck for Investors",
    time: "3:20 PM",
    label: "Work",
    starred: false,
    folder: "inbox",
  },
];

export const initialLabels = ["Primary", "Social", "Work", "Friends"];

export const pricingData = [
  {
    top: {
      package: 'basic',
      charge: 'monthly',
      price: 14.99,
    },
    center: {
      freeSetup: true,
      bandwidth: 10,
      connection: 20,
      analytics: false,
      publicApi: false,
      plugins: false,
      customContent: false,
    },
    bottom: {
      button: 'get started',
      trialDays: 30
    }
  },
  {
    top: {
      package: 'standard',
      charge: 'monthly',
      price: 49.99,
    },
    center: {
      freeSetup: true,
      bandwidth: 10,
      connection: 20,
      analytics: true,
      publicApi: true,
      plugins: false,
      customContent: false,
    },
    bottom: {
      button: 'get started',
      trialDays: 30
    }
  },
  {
    top: {
      package: 'premium',
      charge: 'monthly',
      price: 89.99,
    },
    center: {
      freeSetup: true,
      bandwidth: 10,
      connection: 20,
      analytics: true,
      publicApi: true,
      plugins: true,
      customContent: true,
    },
    bottom: {
      button: 'get started',
      trialDays: 30
    }
  },
]