import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [signInError, setSignInError] = useState(null); // ✅ Separate error for sign-in
  const [googleError, setGoogleError] = useState(null); // ✅ Separate error for Google Sign-In
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // ✅ Handle Sign-In Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignInError(null); // ✅ Reset sign-in errors when submitting
    setGoogleError(null); // ✅ Reset Google errors when switching to sign-in

    // ✅ Validate Email & Password
    if (!formData.email.trim() || !formData.password.trim()) {
      setSignInError("Email and password are required.");
      return;
    }

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

      // ✅ Handle failed login
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setSignInError(data.message); // ✅ Show only for sign-in
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
      setSignInError(error.message);
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
            className="w-full py-3 mt-4 text-lg sm:text-xl font-semibold text-white bg-slate-700 rounded-full shadow-[1px_1px_3px_#1e293b,2px_2px_5px_#334155] transition duration-300 hover:bg-slate-800 hover:shadow-[1px_1px_3px_#334155,-1px_-1px_3px_#1e293b] active:bg-slate-900 active:shadow-[inset_1px_1px_4px_#475569,inset_-2px_-2px_4px_#CBD5E1]"
          >
            {loading ? "Loading.." : "Sign In"}
          </button>
        </form>

        {/* ✅ Pass setSignInError & setGoogleError to OAuth */}
        <OAuth setError={setSignInError} />

        <p className="mt-4 text-slate-600 text-sm">
          Don't have an account?
          <Link to={"/signup"} className="text-blue-800 font-semibold hover:underline ml-1">
            Sign up
          </Link>
        </p>

        {/* ✅ Show sign-in error only */}
        {signInError && <p className="text-red-600 mt-3 text-sm">{signInError}</p>}

        {/* ✅ Show Google sign-in error only */}
        {googleError && <p className="text-red-600 mt-3 text-sm">{googleError}</p>}
      </div>
    </div>
  );
}
