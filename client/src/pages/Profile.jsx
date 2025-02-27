import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
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

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(currentUser?.avatar || "https://via.placeholder.com/150");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Please select a valid image file.");
        return;
      }
      setImageError("");
      setUploadProgress(0);
      setUploadSuccess(false);

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageFile(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    let imageUrl = selectedImage;
    const API_KEY = "6612afba75c17c547e1cf1bd2d1caad4";
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          imageUrl = data.data.url;
        } else {
          setImageError("Image upload failed.");
          return;
        }
      } catch (error) {
        setImageError("Error uploading image.");
        return;
      }
    }

    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, avatar: imageUrl }),
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
        dispatch(deleteUserFailure(data.message));
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
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-0 bg-[rgb(241,245,241)] text-center pt-[100px]">
    <div className="w-full max-w-[320px] sm:max-w-[350px] p-6 sm:p-8 bg-slate-200 rounded-[20px] border-[2px] border-slate-300">
        <h1 className="text-[20px] sm:text-[24px] font-semibold text-slate-700 mb-4">
          Profile
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleFileChange} />
          <img src={selectedImage} alt="profile"  className="rounded-full h-20 w-20 object-cover cursor-pointer self-center border border-gray-300 shadow-md" onClick={() => fileRef.current.click()} />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <p className="text-black text-xs mt-1">Uploading: {uploadProgress}%</p>
          )}
          {imageError && <p className="text-red-600 text-xs">{imageError}</p>}
          {uploadSuccess && <p className="text-green-600 text-xs">Image uploaded successfully!</p>}
          <input type="text" defaultValue={currentUser.username} placeholder="Username" id="username"    className="w-full px-4 py-2 text-sm sm:text-base bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_2px_#a0a0a0,inset_-2px_-2px_4px_#ffffff] border-none focus:outline-none focus:ring-1 focus:ring-slate-500" onChange={handleChange} />
          <input type="email" defaultValue={currentUser.email} placeholder="Email" id="email" className="w-full px-4 py-2 text-sm sm:text-base bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_2px_#a0a0a0,inset_-2px_-2px_4px_#ffffff] border-none focus:outline-none focus:ring-1 focus:ring-slate-500" onChange={handleChange} />
          <input type="password" placeholder="Password" id="password" className="w-full px-4 py-2 text-sm sm:text-base bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_2px_#a0a0a0,inset_-2px_-2px_4px_#ffffff] border-none focus:outline-none focus:ring-1 focus:ring-slate-500" onChange={handleChange} />
          <button disabled={loading}  className="w-full mt-3 py-2 text-sm sm:text-base font-semibold text-white bg-slate-700 rounded-full shadow-[1px_1px_2px_#1e293b,2px_2px_4px_#334155] transition duration-300 hover:bg-slate-800 active:bg-slate-900" >
            {loading ? "Loading.." : "Update"}
          </button>
          <Link  className="w-full py-2 text-sm sm:text-base font-semibold text-white bg-green-700 rounded-full shadow-[1px_1px_2px_#166534,2px_2px_4px_#14532d] transition duration-300 hover:bg-green-800 active:bg-green-900" to="/create-listing">
            Create Listing
          </Link>
        </form>
        <div className="flex justify-between mt-4 text-sm">
          <span onClick={handleDeleteUser} className="text-red-700 font-semibold cursor-pointer hover:underline">
            Delete Account
          </span>
          <span onClick={handleSignOut} className="text-slate-800 font-semibold cursor-pointer hover:underline">
            Sign Out
          </span>
        </div>
        {error && <p className="text-red-700 font-semibold mt-3 text-sm">{error}</p>}
        {updateSuccess && <p className="text-green-700 font-semibold mt-3 text-sm">User Updated Successfully!</p>}
      </div>
    </div>
  );
}
