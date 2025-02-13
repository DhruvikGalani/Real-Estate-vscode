// import React from "react";
// import { useSelector } from "react-redux";

// export default function Profile() {
//   const { currentUser } = useSelector((state) => state.user);
//   return (
//     <div className="p-3 max-w-lg mx-auto">
//       <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
//       <form className="flex flex-col gap-4">
//         <img
//           src={currentUser.avatar}
//           alt="profile"
//           className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"
//         />
//         <input type="text" placeholder="Username" id="username" className="border p-3 rounded-lg"/>
//         <input type="text" placeholder="email" id="email" className="border p-3 rounded-lg"/>
//         <input type="text" placeholder="password" id="password" className="border p-3 rounded-lg"/>
//         <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">Update</button>
//       </form>
//       <div className="flex justify-between mt-5">
//         <span className="text-red-700 cursor-pointer">Delete Account</span>
//         <span className="text-red-700 cursor-pointer">Sign Out</span>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-0 bg-[rgb(241, 245, 241)] text-center">
      <div className="w-full max-w-[400px] sm:max-w-[400px] p-8 sm:p-10 bg-slate-200 rounded-[25px] border-[3px] border-slate-300">
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-slate-700 mb-6">
          Profile
        </h1>
        <form className="flex flex-col gap-4">
          {/* Profile Image */}
          <img
            src={currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center border border-gray-300 shadow-md"
          />

          {/* Input Fields */}
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-slate-500"
          />

          {/* Update Button */}
          <button className="w-full py-3 mt-4 text-lg sm:text-xl font-semibold text-white bg-slate-700 rounded-full shadow-[1px_1px_3px_#1e293b,2px_2px_5px_#334155] transition duration-300 hover:bg-slate-800 hover:shadow-[1px_1px_3px_#334155,-1px_-1px_3px_#1e293b] active:bg-slate-900 active:shadow-[inset_1px_1px_4px_#475569,inset_-2px_-2px_4px_#CBD5E1]">
            Update
          </button>
        </form>

        {/* Delete & Sign Out */}
        <div className="flex justify-between mt-5">
          <span className="text-red-700 font-semibold cursor-pointer hover:underline">
            Delete Account
          </span>
          <span className="text-slate-800-700 font-semibold cursor-pointer hover:underline">
            Sign Out
          </span>
        </div>
      </div>
    </div>
  );
}
