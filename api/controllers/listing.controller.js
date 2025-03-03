// import Listing from "../models/listing.model.js";
// import { errorHandler } from "../utils/error.js";

// export const createListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.create(req.body);
//     return res.status(201).json(listing);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteListing = async (req, res, next) => {
//   const listing = await Listing.findById(req.params.id);
//   if (!listing) {
//     return next(errorHandler(404, "Listing Not Found"));
//   }
//   if (req.user.id !== listing.userRef) {
//     return next(errorHandler(401, "You can only delete your own Listing"));
//   }
//   try {
//     await Listing.findByIdAndDelete(req.params.id);
//     res.status(200).json("Listing has been Deleted!");
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateListing = async (req, res, next) => {
//   const listing = await Listing.findById(req.params.id);
//   if (!listing) {
//     return next(errorHandler(404, "Listing Not Found"));
//   }
//   if (req.user.id !== listing.userRef) {
//     return next(errorHandler(401, "You can only update your Own Listing"));
//   }
//   try {
//     const updatedListing = await Listing.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true } // for updated listing 
//     );
//     res.status(200).json(updatedListing);
//   } catch (error) {
//     next(error);
//   }
// };
import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

// export const deleteListing = async (req, res, next) => {
//   try {
//     const listing = await Listing.findById(req.params.id);
//     if (!listing) {
//       return next(errorHandler(404, "Listing Not Found"));
//     }

//     // ✅ Convert `userRef` ObjectId to string before comparison
//     if (listing.userRef.toString() !== req.user.id) {
//       return next(errorHandler(401, "You can only delete your own Listing"));
//     }

//     await Listing.findByIdAndDelete(req.params.id);
//     res.status(200).json("Listing has been Deleted!");
//   } catch (error) {
//     next(error);
//   }
// };

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing Not Found"));
    }

    // ✅ Convert `userRef` ObjectId to string before comparison
    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(401, "You can only update your Own Listing"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // for updated listing 
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(errorHandler(400, "Invalid Listing ID"));
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing Not Found"));
    }

    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(401, "You can only delete your own Listing"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been Deleted!");
  } catch (error) {
    next(error);
  }
};