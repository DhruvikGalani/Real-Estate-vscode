import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "", //villa
    description: "", //beautifull views
    address: "", //varachha
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false, //true
    parking: false, //true
    furnished: false, //true
  });
  const [fileLabel, setFileLabel] = useState("Choose Files");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploadDisabled, setIsUploadDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "Can be add Listing",
    show: false,
    type: "",
  });

  console.log("Uploaded Image URLs:", formData.imageUrls);
  console.log("Data : ", formData);

  const handleImage = async () => {
    if (files.length > 6) {
      setErrorMessage("You can upload a maximum of 6 images.");
      return;
    }
    setErrorMessage("");
    setIsUploadDisabled(true);

    if (files.length > 0 && files.length < 7) {
      setIsUploading(true);
      setUploadProgress(0);

      let completedUploads = 0;
      const totalFiles = files.length;

      const promises = files.map(async (file) => {
        const url = await uploadToImgBB(file);
        if (url) {
          completedUploads++;
          setUploadProgress(Math.round((completedUploads / totalFiles) * 100));
          return url;
        }
        return null;
      });

      const urls = (await Promise.all(promises)).filter((url) => url !== null);

      setFormData((prevState) => ({
        ...prevState,
        imageUrls: urls,
      }));

      setFiles([]);
      setIsUploading(false);
    }
  };
  const removeImage = (index, event) => {
    if (event) {
      event.preventDefault(); // ✅ Stops accidental form submission
      event.stopPropagation(); // ✅ Prevents bubbling up to parent elements
    }

    setFormData((prevState) => {
      const updatedImageUrls = prevState.imageUrls.filter(
        (_, i) => i !== index
      );
      return { ...prevState, imageUrls: updatedImageUrls };
    });

    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);

      // ✅ Update file label correctly
      setFileLabel(
        updatedFiles.length > 0
          ? `${updatedFiles.length} file(s) selected`
          : "Choose Files"
      );

      return updatedFiles;
    });

    // ✅ Re-enable upload button if images are removed
    setIsUploadDisabled(false);
  };

  const handleImagePreview = (e) => {
    e.preventDefault(); // Prevent form submission

    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 6) {
      setErrorMessage("You can upload a maximum of 6 images.");
      return;
    }

    setErrorMessage("");

    // Update the label with selected file count
    setFileLabel(
      selectedFiles.length > 0
        ? `${selectedFiles.length} file(s) selected`
        : "Choose Files"
    );

    // 🔹 Generate preview URLs and **replace** existing images
    const imagePreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    // 🔹 Replace images instead of appending
    setFormData((prevState) => ({
      ...prevState,
      imageUrls: imagePreviews, // Replace the entire array
    }));

    setFiles(selectedFiles); // Replace the file state
  };

  const uploadToImgBB = async (file) => {
    const API_KEY = "6612afba75c17c547e1cf1bd2d1caad4";
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.data.url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleChange = (e) => {
    const { id, value, type } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prevState) => ({
        ...prevState,
        type: id,
      }));
    } else if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData((prevState) => ({
        ...prevState,
        [id]: e.target.checked,
      }));
    } else if (type === "number") {
      // 🔹 Convert number inputs to actual numbers
      setFormData((prevState) => ({
        ...prevState,
        [id]: Number(value), // Converts string to number
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length > 0) {
      setError("You must upload selected images first.");
      setSnackbar({
        message: "You must upload selected images first.",
        show: true,
        type: "error",
      });

      setTimeout(() => {
        setSnackbar({ message: "", show: false, type: "" });
      }, 3000);
      return;
    }

    if (formData.imageUrls.length < 1) {
      setError("You must upload at least one image.");
      setSnackbar({
        message: "You must upload at least one image.",
        show: true,
        type: "error",
      });

      setTimeout(() => {
        setSnackbar({ message: "", show: false, type: "" });
      }, 3000);
      return;
    }

    if (formData.regularPrice <= formData.discountPrice) {
      setError("Discount Price must be lower than Regular Price");
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        setSnackbar({ message: data.message, show: true, type: "error" });
      } else {
        setSnackbar({
          message: "Listing created successfully",
          show: true,
          type: "success",
        });

        // ✅ Clear form after success
        setFormData({
          imageUrls: [],
          name: "",
          description: "",
          address: "",
          type: "rent",
          bedrooms: 1,
          bathrooms: 1,
          regularPrice: 50,
          discountPrice: 0,
          offer: false,
          parking: false,
          furnished: false,
        });

        // ✅ Clear selected files
        setFiles([]);

        // ✅ Reset file input field
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // ✅ Reset file label
        setFileLabel("Choose Files");
      }

      setTimeout(() => {
        setSnackbar({ message: "", show: false, type: "" });
      }, 3000);
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSnackbar({
        message: "Failed to create listing. Please try again.",
        show: true,
        type: "error",
      });

      setTimeout(() => {
        setSnackbar({ message: "", show: false, type: "" });
      }, 3000);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto pt-[100px]">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 justify-between"
      >
        <div className="flex flex-col gap-4  w-full sm:w-1/2">
          <input
            onChange={handleChange}
            value={formData.name}
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg w-full"
            id="name"
            maxLength="60"
            minLength="3"
            required
          />
          <input
            type="text"
            minLength="10"
            onChange={handleChange}
            value={formData.description}
            placeholder="Description"
            className="border p-3 rounded-lg w-full"
            id="description"
            required
          />
          <input
            onChange={handleChange}
            value={formData.address}
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg w-full"
            id="address"
            minLength="5"
            required
          />

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-4"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-4"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-4"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-4"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-4"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
                className="p-3 border border-gray-300 rounded-lg w-24"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                required
                onChange={handleChange}
                value={formData.bathrooms}
                className="p-3 border border-gray-300 rounded-lg w-24"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 border border-gray-300 rounded-lg w-24"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 border border-gray-300 rounded-lg w-24"
                />
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 space-y-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <div className="flex gap-4 items-center">
              <label
                htmlFor="images"
                className="p-3 border border-gray-300 rounded w-full text-center cursor-pointer bg-gray-100"
              >
                {fileLabel}
              </label>
              <input
                type="file"
                id="images"
                onChange={handleImagePreview}
                className="hidden"
                accept="image/*"
                multiple
                ref={fileInputRef}
              />
            </div>

            <button
              type="button" // Prevents form submission
              onClick={(e) => handleImage(e)}
              className="p-3 text-green-700 border border-green-700 rounded-xl uppercase 
hover:shadow-xl hover:text-white hover:bg-green-800 
transition-all duration-300 ease-in-out 
disabled:opacity-80 disabled:cursor-not-allowed"
              disabled={isUploadDisabled}
            >
              Upload
            </button>
          </div>

          {errorMessage && (
            <div className="text-red-600 text-xs text-center">
              {errorMessage}
            </div>
          )}
          {isUploading && (
            <div className="bg-transparent text-xs leading-none py-1 text-center text-green-700">
              Uploading {uploadProgress.toFixed(0)}% ...
            </div>
          )}

          {!isUploading && formData.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.imageUrls.map((image, index) => (
                <div key={index} className="relative">
                  <button
                    type="button" // ✅ Ensures it's not a submit button
                    onClick={(event) => removeImage(index, event)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 pb-[8px] rounded-full leading-[8px]"
                  >
                    x
                  </button>

                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                </div>
              ))}
            </div>
          )}

          <button disabled={loading || isUploading } className="w-full py-2.5 mt-3 text-sm sm:text-base font-semibold text-white bg-slate-700 rounded-xl shadow-md transition duration-300 hover:bg-slate-800 active:bg-slate-900">
            {loading ? "Createing..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
      {snackbar.show && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-slate-900 font-semibold shadow-inner  transition-opacity duration-300 
    ${snackbar.type === "success" ? "bg-slate-300" : "bg-red-300"} 
    backdrop-blur-md border border-white/20 w-[90%] md:w-auto max-w-sm text-center text-sm md:text-base`}
        >
          {snackbar.message}
        </div>
      )}
    </main>
  );
}
