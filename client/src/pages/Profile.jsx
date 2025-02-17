import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // ✅ State for selected file, image preview, validation, progress, and success message
  const [selectedImage, setSelectedImage] = useState(
    currentUser?.avatar || "https://via.placeholder.com/150"
  );
  const [imageError, setImageError] = useState(""); // ✅ Image error
  const [uploadProgress, setUploadProgress] = useState(0); // ✅ Upload progress
  const [uploadSuccess, setUploadSuccess] = useState(false); // ✅ Success message state
  const [formData, setForData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  console.log("currentUser._id : ", currentUser._id);

  // ✅ Update image preview when a file is selected
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected File:", file);
    if (file) {
      // ✅ Validate file type
      if (!file.type.startsWith("image/")) {
        setImageError("Please select a valid image file.");
        return;
      }

      setImageError(""); // ✅ Clear previous errors
      setUploadProgress(0); // ✅ Reset progress
      setUploadSuccess(false); // ✅ Reset success message

      const imageUrl = URL.createObjectURL(file); // ✅ Creates temporary URL
      setSelectedImage(imageUrl);
      console.log("Selected File:", imageUrl);

      // ✅ Simulate upload process (Fake Progress from 0% to 100%)
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10; // Increase progress by 10% every 300ms
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setUploadSuccess(true); // ✅ Show success message
          setTimeout(() => setUploadSuccess(false), 3000); // ✅ Auto-hide success message after 3s
        }
      }, 300);
    }
  };
  const handleChange = (e) => {
    setForData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmmit = async (e) => {
    e.preventDefault();
    try {
      // console.log("currentUser._id : ",$(currentUser._id));

      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(error.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-0 bg-[rgb(241, 245, 241)] text-center">
      <div className="w-full max-w-[400px] sm:max-w-[400px] p-8 sm:p-10 bg-slate-200 rounded-[25px] border-[3px] border-slate-300">
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-slate-700 mb-6">
          Profile
        </h1>
        <form onSubmit={handleSubmmit} className="flex flex-col gap-4">
          {/* ✅ Hidden File Input */}
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={handleFileChange} // ✅ Corrected event handler
          />

          {/* ✅ Clickable Profile Image */}
          <img
            // onClick={() => fileRef.current.click()}
            src={formData.avatar || selectedImage}
            // src={formData.avatar || selectedImage}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer self-center border border-gray-300 shadow-md"
          />

          {/* ✅ Uploading Progress Text */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <p className="text-black text-sm mt-1">
              Uploading: {uploadProgress}%
            </p>
          )}

          {/* ✅ Show error message if image is not uploaded */}
          {imageError && <p className="text-red-600 text-sm">{imageError}</p>}

          {/* ✅ Show success message when upload completes */}
          {uploadSuccess && (
            <p className="text-green-600 text-sm mt-1">
              Image uploaded successfully!
            </p>
          )}

          {/* Input Fields */}
          <input
            type="text"
            defaultValue={currentUser.username}
            placeholder="Username"
            id="username"
            className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-slate-500"
            onChange={handleChange}
          />
          <input
            type="email"
            defaultValue={currentUser.email}
            placeholder="Email"
            id="email"
            className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-slate-500"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="w-full px-5 py-3 text-base sm:text-lg bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_3px_#a0a0a0,inset_-2px_-2px_5px_#ffffff] border-none focus:outline-none focus:ring-2 focus:ring-slate-500"
            onChange={handleChange}
          />

          {/* ✅ Update Button */}
          <button
            disabled={loading}
            className="w-full py-3 mt-4 text-lg sm:text-xl font-semibold text-white bg-slate-700 rounded-full shadow-[1px_1px_3px_#1e293b,2px_2px_5px_#334155] transition duration-300 hover:bg-slate-800 hover:shadow-[1px_1px_3px_#334155,-1px_-1px_3px_#1e293b] active:bg-slate-900 active:shadow-[inset_1px_1px_4px_#475569,inset_-2px_-2px_4px_#CBD5E1]"
          >
            {loading ? "loading.." : "update"}
          </button>
        </form>

        {/* Delete & Sign Out */}
        <div className="flex justify-between mt-5">
          <span
            onClick={handleDeleteUser}
            className="text-red-700 font-semibold cursor-pointer hover:underline"
          >
            Delete Account
          </span>
          <span
            onClick={handleSignOut}
            className="text-slate-800 font-semibold cursor-pointer hover:underline"
          >
            Sign Out
          </span>
        </div>
        <p className="text-red-700 font-semibold mt-5">{error ? error : ""}</p>
        <p className="text-green-700 font-semibold mt-5">
          {updateSuccess ? "User is Updates Successfully !" : ""}
        </p>
      </div>
    </div>
  );
}
