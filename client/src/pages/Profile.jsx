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

  const [selectedImage, setSelectedImage] = useState(
    currentUser?.avatar || "https://via.placeholder.com/150"
  );
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [ShowLisingError, setShowListingError] = useState(false);
  const [showListings, setShowListings] = useState(false);
  const [userListings, setUserListings] = useState([]);
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
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${API_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );
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

  const handleShowListing = async () => {
    try {
      if (!showListings) {
        setShowListingError(false);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingError(true);
          return;
        }
        setUserListings(data);
      }
      setShowListings((prev) => !prev); // ✅ Toggle only after fetching is done
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-0 bg-[rgb(241,245,241)] text-center pt-[120px]">
      <div className="w-full max-w-[320px] sm:max-w-[350px] p-6 sm:p-8 bg-slate-200 rounded-[20px] border-[2px] border-slate-300 mb-6">
        <h1 className="text-[20px] sm:text-[24px] font-semibold text-slate-700 mb-4">
          Profile
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
          <img
            src={selectedImage}
            alt="profile"
            className="rounded-full h-20 w-20 object-cover cursor-pointer self-center border border-gray-300 shadow-md"
            onClick={() => fileRef.current.click()}
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <p className="text-black text-xs mt-1">
              Uploading: {uploadProgress}%
            </p>
          )}
          {imageError && <p className="text-red-600 text-xs">{imageError}</p>}
          {uploadSuccess && (
            <p className="text-green-600 text-xs">
              Image uploaded successfully!
            </p>
          )}
          <input
            type="text"
            defaultValue={currentUser.username}
            placeholder="Username"
            id="username"
            className="w-full px-4 py-2 text-sm sm:text-base bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_2px_#a0a0a0,inset_-2px_-2px_4px_#ffffff] border-none focus:outline-none focus:ring-1 focus:ring-slate-500"
            onChange={handleChange}
          />
          <input
            type="email"
            defaultValue={currentUser.email}
            placeholder="Email"
            id="email"
            className="w-full px-4 py-2 text-sm sm:text-base bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_2px_#a0a0a0,inset_-2px_-2px_4px_#ffffff] border-none focus:outline-none focus:ring-1 focus:ring-slate-500"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="w-full px-4 py-2 text-sm sm:text-base bg-slate-200 text-slate-700 rounded-full shadow-[inset_1px_1px_2px_#a0a0a0,inset_-2px_-2px_4px_#ffffff] border-none focus:outline-none focus:ring-1 focus:ring-slate-500"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="w-full mt-3 py-2 text-sm sm:text-base font-semibold text-white bg-slate-700 rounded-full shadow-[1px_1px_2px_#1e293b,2px_2px_4px_#334155] transition duration-300 hover:bg-slate-800 active:bg-slate-900"
          >
            {loading ? "Loading.." : "Update"}
          </button>
          <Link
            className="w-full py-2 text-sm sm:text-base font-semibold text-white bg-green-700 rounded-full shadow-[1px_1px_2px_#166534,2px_2px_4px_#14532d] transition duration-300 hover:bg-green-800 active:bg-green-900"
            to="/create-listing"
          >
            Create Listing
          </Link>
        </form>
        <div className="flex justify-between mt-4 text-sm">
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
        {error && (
          <p className="text-red-700 font-semibold mt-3 text-sm">{error}</p>
        )}
        {updateSuccess && (
          <p className="text-green-700 font-semibold mt-3 text-sm">
            User Updated Successfully!
          </p>
        )}

        <button
          onClick={handleShowListing}
          className="text-green-700 mt-4 w-full "
        >
          {showListings ? "Hide Listings" : "Show Listings"}
        </button>
        <p className="text-red-700 mt-1 ">
          {ShowLisingError ? "Error for Showing Listing" : ""}
        </p>
      </div>
      {/* listing design */}
      {/* Show Listings only when showListings is true */}
      {showListings && (
        <div className="flex flex-col max-w-3xl mx-auto">
          <h1 className="text-center text-3xl font-bold text-gray-800 mb-4">
            Your Listings
          </h1>
          {userListings.length > 0 ? (
            userListings.map((listing) => (
              <div key={listing._id} className="relative  mb-3">
                {/* Rent or Sale Label */}
                <p
                  className={`absolute top-2 right-2 z-10 px-2 py-1 text-xs font-semibold rounded ${
                    listing.type === "sale"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {listing.type === "sale" ? "For Sale" : "For Rent"}
                </p>

                {/* Listing Container */}
                <div className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg">
                  {/* Listing Image */}
                  <Link
                    to={`/listings/${listing._id}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={
                        listing.imageUrls?.[0] ||
                        "https://via.placeholder.com/100"
                      }
                      alt="listing cover"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </Link>

                  {/* Listing Details */}
                  <div className="flex-1">
                    <Link
                      to={`/listings/${listing._id}`}
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition"
                    >
                      {listing.name}
                    </Link>
                    <p className="text-sm text-gray-600">{listing.address}</p>
                    <p className="text-sm text-gray-500">
                      {listing.bedrooms} BHK &nbsp; | &nbsp;
                      {listing.bathrooms} Bath
                    </p>
                    <p className="text-2xl font-semibold text-blue-800">
                      $
                      {listing.offer
                        ? listing.discountPrice
                        : listing.regularPrice}
                      {listing.offer && (
                        <span className="text-gray-500 line-through text-sm ml-2">
                          ₹ {listing.regularPrice}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleListingDelete(listing._id)}
                      className="text-red-600 font-semibold hover:underline transition"
                    >
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className="text-green-600 font-semibold hover:underline transition">
                        Edit
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No listings available</p>
          )}
        </div>
      )}
    </div>
  );
}
