import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.mjs";
import generateToken from "../utils/generateToken.mjs";
import uploadFileOnCloudinary from "../utils/cloudinary.mjs";

const register = asyncHandler(async (request, response) => {
  const { username, fullName, email, password, contactNumber, age, city } = request.body;

  if (!username || !email || !password || !contactNumber) {
    response.status(400);
    throw new Error("Input all required fields.");
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    response.status(401);
    throw new Error("Username or email already registered.");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  let avatarUrl = null;
  if (request.file) {
    const uploadedOnCloudinary = await uploadFileOnCloudinary(request.file.path);
    avatarUrl = uploadedOnCloudinary?.url || null;
  }

  const user = await User.create({
    username,
    fullName,
    email,
    password: hashPassword,
    contactNumber,
    age,
    city,
    avatar: avatarUrl,
  });

  const token = generateToken(user._id);
  response.cookie("token", token, {
    maxAge: 6 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  const safeUser = user.toObject();
  delete safeUser.password;

  response.status(201).json({ message: `Account created.`, success: true, user: safeUser, token });
});

const login = asyncHandler(async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({
      message: "Input all fields",
      success: false,
    });
  }

  const user = await User.findOne({ $or: [{ email }, { username: email }] });
  if (!user) {
    return response.status(401).json({
      message: "User not registered.",
      success: false,
    });
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return response.status(401).json({
      message: "Invalid password",
      success: false,
    });
  }

  const token = generateToken(user._id);

  response.cookie("token", token, {
    maxAge: 6 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  const safeUser = user.toObject();
  delete safeUser.password;

  response.status(200).json({
    message: "Login successful.",
    success: true,
    user: safeUser,
    token,
  });
});

const logout = asyncHandler(async (request, response) => {
  response.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  response.status(200).json({
    message: "Logged out successfully.",
    success: true,
  });
});

const profile = asyncHandler(async (request, response) => {
  const user = await User.findById(request.user._id).select("-password");
  response.status(200).json({ user, success: true });
});

export { register, login, profile, logout };
