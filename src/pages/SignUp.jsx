/* eslint-disable no-unused-vars */
import { Link } from 'react-router-dom'
import Pattern3 from '../assets/images/pattern_3.png'
import CustomPasswordInput from '../ui/CustomPasswordInput'
import axios from "axios";
const API_URL = "http://127.0.0.1:8000/api";

const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/`, {
      withCredentials: true, // Ensures cookies (e.g., session or auth tokens) are sent
    });
    const userData = response.data;
    console.log("✅ Fetched user data:", userData);
    return userData;
  } catch (error) {
    console.error("🔥 Error fetching user:", error.response?.data || error.message);
    throw error; // Optionally rethrow the error for further handling
  }
};

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
  ```git 
*/
export default function SignUp() {
fetchUserInfo()
  .then(data => {
    if (data) {
      console.log("User ID:", data.id);
      console.log("Username:", data.username);
      console.log("Email:", data.email);
      console.log("Full Name:", data.full_name);
      console.log("Is Superuser?", data.is_superuser);
      console.log("Is Staff?", data.is_staff);
    }
  })
  .catch(err => console.log("Failed to fetch user info"));
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
            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create an Account
            </h2>
            <p className='text-center mb-5'>Create an account to continue</p>
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder='esteban_schiller@gmail.com'
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#F1F4F9] px-3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    required
                    placeholder='username'
                    autoComplete="username"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#F1F4F9] px-3"
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between'>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm leading-6">
                    <a href="#" className="font-semibold text-brand-primary-black text-opacity-60 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#F1F4F9] px-3"
                  />
                </div>
                {/* //fixme - use me */}
                {/* <CustomPasswordInput /> */}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                    I accept terms and conditions
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?
                <Link href="/login" className="font-semibold leading-6 text-[#5A8CFF] hover:text-indigo-500 ml-1">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
