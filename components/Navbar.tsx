'use client'

import Image from "next/image";//replace <img/>
import Link from "next/link";
// import { FaGoogle } from 'react-icons/fa';
import { useState } from "react";


const Navbar = () => {
  // Simulated login state (replace with real auth logic later)
  const [isLogin, setIsLogin] = useState(false);

  return (
    <nav className="bg-white shadow py-4 px-6 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-700">
        Literature Society
      </Link>
      <div className="flex items-center space-x-4">
        {!isLogin ? (
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setIsLogin(true)} // Simulate login
          >
            Login
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
            onClick={() => setIsLogin(false)}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}
 
export default Navbar;//we can embedded this to layout