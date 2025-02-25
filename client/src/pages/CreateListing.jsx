import React, { useState } from "react";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [fileLabel, setFileLabel] = useState("Choose Files");

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploadDisabled, setIsUploadDisabled] = useState(false);

  console.log("Uploaded Image URLs:", formData.imageUrls);

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
  const removeImage = (index) => {
    setFormData((prevState) => {
      const updatedImageUrls = prevState.imageUrls.filter((_, i) => i !== index);
      return { ...prevState, imageUrls: updatedImageUrls };
    });
  
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
  
      // Update file label after removal
      if (updatedFiles.length > 0) {
        setFileLabel(`${updatedFiles.length} file(s) selected`);
      } else {
        setFileLabel("Choose Files");
      }
  
      return updatedFiles;
    });
  
    // Ensure upload button is re-enabled when images are removed
    setIsUploadDisabled((prevFiles.length - 1) >= 6);
  };
  
const handleImagePreview = (e) => {
  const selectedFiles = Array.from(e.target.files);

  if (selectedFiles.length > 6) {
    setErrorMessage("You can upload a maximum of 6 images.");
    return;
  }

  setErrorMessage("");

  // Update the label with selected file count
  if (selectedFiles.length > 0) {
    setFileLabel(`${selectedFiles.length} file(s) selected`);
  } else {
    setFileLabel("Choose Files");
  }

  const imagePreviews = selectedFiles.map((file) =>
    URL.createObjectURL(file)
  );

  setFormData((prevState) => ({
    ...prevState,
    imageUrls: imagePreviews,
  }));

  setFiles(selectedFiles);
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

  return (
    <main className="p-3 max-w-4xl mx-auto pt-[100px]">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-wrap gap-4 justify-between">
        <div className="flex flex-col gap-4  w-full sm:w-1/2">
          <input
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
            placeholder="Description"
            className="border p-3 rounded-lg w-full"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg w-full"
            id="address"
            minLength="5"
            required
          />

          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-4" />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-4" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-4" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-4" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-4" />
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
                className="p-3 border border-gray-300 rounded-lg w-24"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={1}
                required
                className="p-3 border border-gray-300 rounded-lg w-24"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min={1}
                required
                className="p-3 border border-gray-300 rounded-lg w-24"
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
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
  <label htmlFor="images" className="p-3 border border-gray-300 rounded w-full text-center cursor-pointer bg-gray-100">
    {fileLabel}
  </label>
  <input
    type="file"
    id="images"
    onChange={handleImagePreview}
    className="hidden"
    accept="image/*"
    multiple
  />
</div>

            <button
              type="button"
              onClick={handleImage}
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
                    onClick={() => removeImage(index)}
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

          <button className="w-full py-2.5 mt-3 text-sm sm:text-base font-semibold text-white bg-slate-700 rounded-xl shadow-md transition duration-300 hover:bg-slate-800 active:bg-slate-900">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
