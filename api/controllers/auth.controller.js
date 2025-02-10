import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Duplicate user" });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User Created Successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(402, "User Not Found!"));

    const validpassword = bcryptjs.compareSync(password, validUser.password);
    if (!validpassword) return next(errorHandler(401, "Invalid Password"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    //hide password in api calling (signin)
    const {password:pass , ...rest} = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
