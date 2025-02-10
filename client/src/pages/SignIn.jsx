import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //set josn & values
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // submit data to signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
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
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-0 bg-[rgb(241, 245, 241)] text-center">
      <div className="w-full max-w-[400px] sm:max-w-[400px] p-8 sm:p-10 bg-slate-200 rounded-[25px] border-[3px] border-slate-300">
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-slate-700 mb-6">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
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
            className="w-full py-3 mt-4 text-lg sm:text-xl font-semibold text-white bg-slate-700 rounded-full shadow-[1px_1px_3px_#1e293b,2px_2px_5px_#374151] transition duration-300 hover:bg-slate-800 hover:shadow-[1px_1px_3px_#374151,-1px_-1px_3px_#1e293b] active:bg-slate-900 active:shadow-[inset_1px_1px_4px_#64748B,inset_-2px_-2px_4px_#E2E8F0]"
          >
            {loading ? "Loading.." : "Sign In "}
          </button>
        </form>
        <p className="mt-4 text-slate-600 text-sm"> </p>
        Don't have an account?
        <Link
          to={"/signup"}
          className="text-blue-800 font-semibold hover:underline ml-1"
        >
          Sign up
        </Link>
        {/* for print error */}
        {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
      </div>
    </div>
  );
}
