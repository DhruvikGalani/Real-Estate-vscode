
import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-slate-200 shadow-md h-[90px] flex items-center w-full fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center mx-auto w-full px-6 md:px-[100px] h-full">
        <Link to={"/"}>
          <h1 className="font-bold flex flex-wrap">
            <span className="text-slate-700 font-bold text-[36px] leading-[50px]">
              Karma&nbsp;
            </span>
            <span className="text-slate-500 font-bold text-[36px] leading-[50px]">
              Estate
            </span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form className="relative w-[200px] md:w-[250px] lg:w-[300px]">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-100 px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 text-lg" />
        </form>

        {/* Navigation Links */}
        <ul className="flex gap-6 items-center">
          <li>
            <Link
              to={"/"}
              className="text-slate-800 relative cursor-pointer 
            after:absolute after:left-0 after:bottom-0 
            after:w-[100%] after:h-[2.5px] after:bg-slate-500 after:transition-transform 
            after:origin-center after:scale-x-0 hover:after:opacity-100 hover:after:scale-x-100 after:rounded-full"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to={"/about"}
              className="text-slate-800 relative cursor-pointer 
            after:absolute after:left-0 after:bottom-0 
            after:w-[100%] after:h-[2.5px] after:bg-slate-500 after:transition-transform 
            after:origin-center after:scale-x-0 hover:after:opacity-100 hover:after:scale-x-100 after:rounded-full"
            >
              About
            </Link>
          </li>
          <li>
    
            {/* <Link to={currentUser ? "/profile" : "/signin"}> */}
            <Link to={"/profile"}>
              {currentUser ? (
                <img
                  src={currentUser.avatar}

                  
                  alt="profile"
                  className="w-[35px] h-[35px] rounded-full object-cover border border-gray-300"
                />
                
              ) : (
                <span
                  className="text-slate-800 relative cursor-pointer 
                after:absolute after:left-0 after:bottom-0 
                after:w-[100%] after:h-[2.5px] after:bg-slate-500 after:transition-transform 
                after:origin-center after:scale-x-0 hover:after:opacity-100 hover:after:scale-x-100 after:rounded-full"
                >
                  Sign in
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
