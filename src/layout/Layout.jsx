/* eslint-disable no-unused-vars */
/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
'use client'

import { useState ,useEffect,} from 'react'
import { Link, Outlet, useLocation } from "react-router-dom";
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
} from '@headlessui/react'
import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { LiaHeart, LiaListAlt, LiaGiftSolid, LiaCalendar, LiaClipboard, LiaUserFriendsSolid, LiaUserSolid, LiaTableSolid, LiaCogSolid, LiaPowerOffSolid, } from "react-icons/lia";
import { SlChart } from "react-icons/sl";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { PiGridFour } from "react-icons/pi";
import { AiOutlineDashboard } from "react-icons/ai";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { PiSquareSplitVerticalBold } from "react-icons/pi";
import SearchBar from '../components/SearchBar';
import NavDrawer from '../ui/NavDrawer';
import AppLogo from '../assets/images/dash_stack_logo.png'
import axios from "axios";

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: AiOutlineDashboard, current: false },
    { name: 'Products', href: '/products', icon: PiGridFour, current: false },
    { name: 'Category', href: '/category', icon: PiGridFour, current: false },
    { name: 'warehouses', href: '/warehouses', icon: PiGridFour, current: false },
    { name: 'warehouse-locations', href: '/warehouse-locations', icon: PiGridFour, current: false },
    { name: 'stock-placements', href: '/stock-placements', icon: PiGridFour, current: false },
    { name: 'stock-transactions', href: '/stock-transactions', icon: PiGridFour, current: false },
    { name: 'stock-audits', href: '/stock-audits', icon: PiGridFour, current: false },
    { name: 'Supplie', href: '/supplie', icon: PiGridFour, current: false },
    { name: 'customers', href: '/customers', icon: PiGridFour, current: false },
    { name: 'customer-accounts', href: '/customer-accounts', icon: PiGridFour, current: false },
    { name: 'order', href: '/order', icon: PiGridFour, current: false },
    { name: 'Favorites', href: '/favorites', icon: LiaHeart, current: false },
    { name: 'Inbox', href: '/inbox', icon: HiOutlineChatAlt2, current: false },
    { name: 'Order Lists', href: '/order-lists', icon: LiaListAlt, current: false },
    { name: 'Products Stock', href: '/product-stock', icon: PiSquareSplitVerticalBold, current: false },
]
const pages = [
    { id: 1, name: 'Pricing', href: '/pricing', icon: LiaGiftSolid, current: false },
    { id: 2, name: 'Calendar', href: '/calendar', icon: LiaCalendar, current: false },
    { id: 3, name: 'To-Do', href: '/todo', icon: LiaClipboard, current: false },
    { id: 4, name: 'Contact', href: '/contact', icon: LiaUserFriendsSolid, current: false },
    { id: 5, name: 'Invoice', href: '/invoice', icon: FaRegMoneyBillAlt, current: false },
    { id: 6, name: 'UI Elements', href: '/ui-elements', icon: SlChart, current: false },
    { id: 7, name: 'Team', href: '/team', icon: LiaUserSolid, current: false },
    { id: 8, name: 'Table', href: '/table', icon: LiaTableSolid, current: false },
]
const bottomNavigation = [
    { name: 'Settings', href: '#', icon: LiaCogSolid, current: false },
    { name: 'Logout', href: '#', icon: LiaPowerOffSolid, current: false },
]
const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}
axios.defaults.withCredentials = true;
export default function Layout() {
 
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [shrinkSidebar, setShrinkSidebar] = useState(false)
    const location = useLocation()
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

      const logout = async () => {
        try {
            const response = await axios.post(
                "/api/logout/",
                {}, // No need to send refresh token
                { withCredentials: true }
            );
    
            if (response.status === 200) {
                alert("Logged out successfully");
                window.location.href = "/login";
            } else {
                console.error("Logout failed:", response.data);
            }
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
        }
    };
    
    return (
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
            <div>
                <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                    />

                    <div className="fixed inset-0 flex">
                        <DialogPanel
                            transition
                            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                        >
                            <TransitionChild>
                                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                                    <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                            </TransitionChild>
                            {/* Sidebar component, swap this element with another sidebar if you like */}
                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                                <div className="flex h-16 shrink-0 items-center">
                                    <img
                                        alt="DashStack logo"
                                        src={AppLogo}
                                        className="h-8 w-auto"
                                    />
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <a
                                                            href={item.href}
                                                            className={classNames(
                                                                item.current
                                                                    ? 'bg-gray-50 text-brand-primary-blue'
                                                                    : 'text-brand-primary-black hover:bg-gray-50 hover:text-brand-primary-blue',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                            )}
                                                        >
                                                            <item.icon
                                                                aria-hidden="true"
                                                                className={classNames(
                                                                    item.current ? 'text-brand-primary-blue' : 'text-brand-primary-black group-hover:text-brand-primary-blue',
                                                                    'h-6 w-6 shrink-0',
                                                                )}
                                                            />
                                                            {item.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li>
                                            <div className="text-xs font-semibold leading-6 text-gray-400">Pages</div>
                                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                                                {pages.map((page) => (
                                                    <li key={page.name}>
                                                        <a
                                                            href={page.href}
                                                            className={classNames(
                                                                page.current
                                                                    ? 'bg-gray-50 text-brand-primary-blue'
                                                                    : 'text-brand-primary-black hover:bg-gray-50 hover:text-brand-primary-blue',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                            )}
                                                        >
                                                            <span
                                                                className={classNames(
                                                                    page.current
                                                                        ? 'border-indigo-600 text-brand-primary-blue'
                                                                        : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-brand-primary-blue',
                                                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium',
                                                                )}
                                                            >
                                                                {page.icon}
                                                            </span>
                                                            <span className="truncate">{page.name}</span>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li className="mt-auto">
                                            <a
                                                href="#"
                                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-brand-primary-black hover:bg-gray-50 hover:text-brand-primary-blue"
                                            >
                                                <Cog6ToothIcon
                                                    aria-hidden="true"
                                                    className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-brand-primary-blue"
                                                />
                                                Settings
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                {/* Static sidebar for desktop */}
                <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col ${shrinkSidebar ? 'lg:w-fit' : 'lg:w-72'}`}>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-scroll  border-r border-gray-200 bg-white px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center gap-3">
                            <img
                                alt="DashStack Logo"
                                src={AppLogo}
                                className="h-8 w-auto"
                            />
                            <h3 className={`text-brand-primary-black font-semibold ${shrinkSidebar ? 'hidden' : 'flex'}`}><span className='text-[#2CABE0]'>Dash</span>Stack</h3>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.href}
                                                    className={classNames(
                                                        location.pathname === item.href
                                                            ? 'bg-brand-primary-blue text-[#fff]'
                                                            : 'text-brand-primary-black hover:bg-gray-100 hover:text-brand-primary-blue',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                    )}
                                                >
                                                    {/* {
                                                        location.pathname === item.href
                                                    } */}
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            location.pathname === item.href ? 'text-[#fff]' : 'text-brand-primary-black group-hover:text-brand-primary-blue',
                                                            'h-6 w-6 shrink-0',
                                                        )}
                                                    />
                                                    {shrinkSidebar ? '' : item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <div className="text-xs font-semibold leading-6 text-gray-400">Your pages</div>
                                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                                        {pages.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.href}
                                                    className={classNames(
                                                        location.pathname === item.href
                                                            ? 'bg-brand-primary-blue text-[#fff]'
                                                            : 'text-brand-primary-black hover:bg-gray-100 hover:text-brand-primary-blue',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                                    )}
                                                >
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            location.pathname === item.href ? 'text-[#fff]' : 'text-brand-primary-black group-hover:text-brand-primary-blue',
                                                            'h-6 w-6 shrink-0',
                                                        )}
                                                    />
                                                    {shrinkSidebar ? '' : item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                    {bottomNavigation.map((item) => (
    <li key={item.name}>
        {item.name === "Logout" ? (
            <button
                onClick={logout}
                className={classNames(
                    'w-full text-left', // Makes the button look like a link
                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                    'text-brand-primary-black hover:bg-gray-100 hover:text-brand-primary-blue'
                )}
            >
                <item.icon
                    aria-hidden="true"
                    className={classNames(
                        'h-6 w-6 shrink-0',
                        'text-brand-primary-black group-hover:text-brand-primary-blue'
                    )}
                />
                {shrinkSidebar ? '' : item.name}
            </button>
        ) : (
            <Link
                to={item.href}
                className={classNames(
                    location.pathname === item.href
                        ? 'bg-brand-primary-blue text-[#fff]'
                        : 'text-brand-primary-black hover:bg-gray-100 hover:text-brand-primary-blue',
                    'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                )}
            >
                <item.icon
                    aria-hidden="true"
                    className={classNames(
                        location.pathname === item.href
                            ? 'text-[#fff]'
                            : 'text-brand-primary-black group-hover:text-brand-primary-blue',
                        'h-6 w-6 shrink-0'
                    )}
                />
                {shrinkSidebar ? '' : item.name}
            </Link>
        )}
    </li>
))}

                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* navbar */}
                <div className="lg:pl-72">
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button type="button" onClick={() => setSidebarOpen(true)} className="-m-2.5 p-2.5 text-brand-primary-black lg:hidden">
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                        </button>

                        {/* Separator */}
                        <div aria-hidden="true" className="h-6 w-px bg-gray-200 lg:hidden" />

                        <div className="flex flex-1 items-center justify-between gap-x-4 self-strentch lg:gap-x-6">

                            <span className='flex items-center gap-5 w-1/2'>
                            {/* //fixme - shrink side bar */}
                                {/* <NavDrawer onClick={() => setShrinkSidebar(!shrinkSidebar)} /> */}
                                <SearchBar classNames={'w-1/2 bg-[#fff]'} inputClassNames={'block w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-[#F5F6FA]'} />
                            </span>

                            {/* <form action="#" method="GET" className="relative flex flex-1">
                                <label htmlFor="search-field" className="sr-only">
                                    Search
                                </label>
                                <MagnifyingGlassIcon
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                                />
                                <input
                                    id="search-field"
                                    name="search"
                                    type="search"
                                    placeholder="Search..."
                                    className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                />
                            </form> */}
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                                    <span className="sr-only">View notifications</span>
                                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                                </button>

                                {/* Separator */}
                                <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative">
                                    <MenuButton className="-m-1.5 flex items-center p-1.5">
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            alt=""
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            className="h-8 w-8 rounded-full bg-gray-50"
                                        />
                                        <span className="hidden lg:flex lg:items-center">
                                            <span aria-hidden="true" className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                                                {
                                                    protectedData && (
                                                        <>
                                                        {protectedData.full_name}
                                                        </>
                                                    )
                                                }
                                            </span>
                                            <ChevronDownIcon aria-hidden="true" className="ml-2 h-5 w-5 text-gray-400" />
                                        </span>
                                    </MenuButton>
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                    >
                                        {userNavigation.map((item) => (
                                            <MenuItem key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                                                >
                                                    {item.name}
                                                </a>
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <main className="py-5 bg-[#F5F6FA] min-h-screen">
                        <div className="px-4 sm:px-6 lg:px-8"><Outlet /></div>
                    </main>
                </div>
            </div>
        </>
    )
}
