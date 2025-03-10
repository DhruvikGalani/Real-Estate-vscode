import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [signUpError, setSignUpError] = useState(null);
  const [googleError, setGoogleError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignUpError(null);
    setGoogleError(null);

    if (
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setSignUpError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setLoading(false);
        setSignUpError(data.message);
        return;
      }

      setLoading(false);
      setSignUpError(null);
      navigate("/");
    } catch (error) {
      setLoading(false);
      setSignUpError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-0 bg-[rgb(241,245,241)] text-center ">
      <div className="w-full max-w-[320px] sm:max-w-[350px] p-6 sm:p-8 bg-slate-200 rounded-[20px] border-[2px] border-slate-300">
        <h1 className="text-[20px] sm:text-[24px] font-semibold text-slate-700 mb-4">
          Join Our Community
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            id="username"
            placeholder="User Name"
            className="w-full px-4 py-2.5 text-sm sm:text-base bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_2px_#a0a0a0,inset_-2px_-2px_4px_#ffffff] focus:outline-none focus:ring-1 focus:ring-slate-500"
            onChange={handleChange}
          />
  
          <input
            type="email"
            id="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm sm:text-base bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_2px_#a0a0a0,inset_-2px_-2px_4px_#ffffff] focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
  
          <input
            id="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm sm:text-base bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_2px_#a0a0a0,inset_-2px_-2px_4px_#ffffff] focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
  
          <button
            disabled={loading}
            className="w-full py-2.5 mt-3 text-sm sm:text-base font-semibold text-white bg-slate-700 rounded-full shadow-[1px_1px_2px_#1e293b,2px_2px_4px_#334155] transition duration-300 hover:bg-slate-800 active:bg-slate-900"
          >
            {loading ? "Loading.." : "Sign Up"}
          </button>
        </form>
  
        {/* OAuth Button */}
        <OAuth setError={setSignUpError} />
  
        <p className="mt-3 text-slate-600 text-[14px]">
          Already have an account?
          <Link to={"/signin"} className="text-blue-800 font-semibold hover:underline ml-1">
            Sign in
          </Link>
        </p>
  
        {/* Show Errors */}
        {signUpError && <p className="text-red-600 mt-3 text-xs">{signUpError}</p>}
        {googleError && <p className="text-red-600 mt-3 text-xs">{googleError}</p>}
      </div>
    </div>
  );
  

  // return (
  //   <div className="min-h-screen flex items-center justify-center px-4 sm:px-0 bg-[rgb(241, 245, 241)] text-center">
  //     <div className="w-full max-w-[400px] sm:max-w-[400px] p-8 sm:p-10 bg-slate-200 rounded-[25px] border-[3px] border-slate-300">
  //       <h1 className="text-[24px] sm:text-[28px] font-semibold text-slate-700 mb-6">
  //         Join Our Community
  //       </h1>
  //       <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
  //         <input
  //           type="text"
  //           id="username"
  //           placeholder="User Name"
  //           className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] focus:outline-none focus:ring-2 focus:ring-slate-500"
  //           onChange={handleChange}
  //         />

  //         <input
  //           type="email"
  //           id="email"
  //           placeholder="Email"
  //           onChange={handleChange}
  //           className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] focus:outline-none focus:ring-2 focus:ring-slate-500"
  //         />

  //         <input
  //           id="password"
  //           type="password"
  //           placeholder="Password"
  //           onChange={handleChange}
  //           className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] focus:outline-none focus:ring-2 focus:ring-slate-500"
  //         />

  //         <button
  //           disabled={loading}
  //           className="w-full py-3 mt-4 text-lg sm:text-xl font-semibold text-white bg-slate-700 rounded-full shadow-[1px_1px_3px_#1e293b,2px_2px_5px_#334155] transition duration-300 hover:bg-slate-800 hover:shadow-[1px_1px_3px_#334155,-1px_-1px_3px_#1e293b] active:bg-slate-900 active:shadow-[inset_1px_1px_4px_#475569,inset_-2px_-2px_4px_#CBD5E1]"
  //         >
  //           {loading ? "Loading.." : "Sign Up"}
  //         </button>
  //       </form>
  //       {/* ✅ Pass setSignUpError & setGoogleError to OAuth */}
  //       <OAuth setError={setSignUpError} />

  //       <p className="mt-4 text-slate-600 text-sm"> </p>
  //       Already have an account?
  //       <Link
  //         to={"/signin"}
  //         className="text-blue-800 font-semibold hover:underline ml-1"
  //       >
  //         Sign in
  //       </Link>
  //       {/* ✅ Show sign-up error only */}
  //       {signUpError && (
  //         <p className="text-red-600 mt-3 text-sm">{signUpError}</p>
  //       )}
  //       {/* ✅ Show Google sign-in error only */}
  //       {googleError && (
  //         <p className="text-red-600 mt-3 text-sm">{googleError}</p>
  //       )}
  //     </div>
  //   </div>
  // );
}
