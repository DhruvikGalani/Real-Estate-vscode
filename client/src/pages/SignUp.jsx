import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  // submit data to signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      // check success status
      if (data.success == false) {
        //give custom error
        setloading(false);
        setError(data.message);
        return; 
      }
      setloading(false);
      setError(null);
      navigate('/');
    } catch (error) {
      setloading(false);
      setError(error.message);
    }
  };

  //set josn & values
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-0 bg-[rgb(241, 245, 241)] text-center">
      <div className="w-full max-w-[400px] sm:max-w-[400px] p-8 sm:p-10 bg-slate-200 rounded-[25px] border-[3px] border-slate-300">
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-slate-700 mb-6">
          Join Our Community
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <input
            type="text"
            id="username"
            placeholder="User Name"
            className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] focus:outline-none focus:ring-2 focus:ring-slate-500"
            onChange={handleChange}
          />

          <input
            type="email"
            id="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] focus:outline-none focus:ring-2 focus:ring-slate-500"
          />

          <input
            id="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] focus:outline-none focus:ring-2 focus:ring-slate-500"
          />

          <button
            disabled={loading}
            className="w-full py-3 mt-4 text-lg sm:text-xl font-semibold text-white bg-slate-700 rounded-full shadow-[1px_1px_3px_#1e293b,2px_2px_5px_#334155] transition duration-300 hover:bg-slate-800 hover:shadow-[1px_1px_3px_#334155,-1px_-1px_3px_#1e293b] active:bg-slate-900 active:shadow-[inset_1px_1px_4px_#475569,inset_-2px_-2px_4px_#CBD5E1]"
            >
            {/* {loading ? "Loading.." : "Sign Up "} */}
            Sign Up
          </button>
          <OAuth/>
        </form>
        <p className="mt-4 text-slate-600 text-sm"> </p>
        Already have an account?
        <Link
          to={"/signin"}
          className="text-blue-800 font-semibold hover:underline ml-1"
        >
          Sign in
        </Link>

        {/* for print error */}
        {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}

      </div>
    </div>
  );
}
