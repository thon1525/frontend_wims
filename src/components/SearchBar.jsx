/* eslint-disable react/prop-types */
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"

const SearchBar = ({environment, classNames, inputClassNames}) => {
    return (
        <div className={`relative rounded-full ${classNames}`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
            </div>
            <input
                id="search"
                name="search"
                type="search"
                placeholder={`Search ${environment ? environment : ''}`}
                className={`block w-full rounded-full border-0 bg-transparent py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${inputClassNames}`}
            />
        </div>
    )
}

export default SearchBar