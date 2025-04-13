/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom'
import Pattern3 from '../assets/images/pattern_3.png'
import NotFoundImage from '../assets/images/404.png'
import CustomPasswordInput from '../ui/CustomPasswordInput'

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
export default function NotFound() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8" style={{ backgroundImage: `url(${Pattern3})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#4880FF' }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <img src={NotFoundImage} alt="Not found" className='mb-20' />
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-5">
              Looks like you’ve got lost….
            </h2>
            <Link
              href="/"
              className="flex w-full justify-center rounded-md bg-brand-primary-blue px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
