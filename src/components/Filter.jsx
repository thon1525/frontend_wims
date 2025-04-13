import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { FiFilter } from "react-icons/fi";
import { VscDebugRestart } from "react-icons/vsc";

const items = [
  { name: 'Save and schedule', href: '#' },
  { name: 'Save and publish', href: '#' },
  { name: 'Export PDF', href: '#' },
]

export default function Filter() {
  return (
    <div className="inline-flex rounded-md shadow-sm">
      <button
        type="button"
        className="relative inline-flex items-center gap-x-1.5 rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-brand-primary-black ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
      >
        <FiFilter aria-hidden="true" className="-ml-0.5 h-5 w-5 text-brand-primary-black" />
      </button>
      <button
        type="button"
        className="relative inline-flex items-center bg-white px-3 py-2 text-sm font-normal text-brand-primary-black ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
      >
        Filter By
      </button>
      <Menu as="div" className="relative -ml-px block">
        <MenuButton className="relative inline-flex items-center gap-5 bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
          <span className="font-normal text-brand-primary-black">Date</span>
          <ChevronDownIcon aria-hidden="true" className="h-5 w-5 font-normal text-brand-primary-black" />
        </MenuButton>
        <MenuItems
          transition
          className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-1">
            {items.map((item) => (
              <MenuItem key={item.name}>
                <a
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  {item.name}
                </a>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
      <Menu as="div" className="relative -ml-px block">
        <MenuButton className="relative inline-flex items-center gap-5 bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
          <span className="font-normal text-brand-primary-black">Order Type</span>
          <ChevronDownIcon aria-hidden="true" className="h-5 w-5 font-normal text-brand-primary-black" />
        </MenuButton>
        <MenuItems
          transition
          className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-1">
            {items.map((item) => (
              <MenuItem key={item.name}>
                <a
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  {item.name}
                </a>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
      <Menu as="div" className="relative -ml-px block">
        <MenuButton className="relative inline-flex items-center gap-5 bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
          <span className="font-normal text-brand-primary-black">Order Status</span>
          <ChevronDownIcon aria-hidden="true" className="h-5 w-5 font-normal text-brand-primary-black" />
        </MenuButton>
        <MenuItems
          transition
          className="absolute right-0 z-10 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-1">
            {items.map((item) => (
              <MenuItem key={item.name}>
                <a
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  {item.name}
                </a>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>
      {/* //fixme - shown only when a filter is added */}
      <button
        type="button"
        className="relative inline-flex items-center gap-3 rounded-r-md bg-white px-3 py-2 text-sm font-normal text-[#EA0234] ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
      >
        <VscDebugRestart />
        Reset Filter
      </button>
    </div>
  )
}
