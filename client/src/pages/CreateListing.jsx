import React from "react";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto pt-6">
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
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              className="p-3 text-green-700 border border-green-700 rounded-xl uppercase 
hover:shadow-xl hover:text-white hover:bg-green-800 
transition-all duration-300 ease-in-out 
disabled:opacity-80 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>

          <button className="w-full py-2.5 mt-3 text-sm sm:text-base font-semibold text-white bg-slate-700 rounded-xl shadow-[1px_1px_2px_#1e293b,2px_2px_4px_#334155] transition duration-300 hover:bg-slate-800 active:bg-slate-900">
            Create Listing
          </button>
        </div>{" "}
      </form>
    </main>
  );
}
