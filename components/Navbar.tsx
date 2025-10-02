'use client'

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutUser } from "@/api/auth";


const Navbar = () => {
  const router = useRouter();
  const { setAccessToken, username, setUsername } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAccessToken(null);
      setUsername('');
      localStorage.clear();
      router.replace('/');
    } catch (err: any) {
      console.log('logout failed: ', err);
    }
  }

  return (
    <nav className="bg-white shadow py-4 px-6 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-700">
        Literature Society
      </Link>
      <div className="flex items-center space-x-4">
        {!username ? (
          <>
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-700 font-medium transition px-3 py-2 leading-none"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition px-3 py-2 rounded-md leading-none"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="hidden sm:block text-gray-700 font-md px-2">
              Welcome, {username}
            </span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-900 font-md trasition px-3 py-2 leading-none"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
 
export default Navbar;