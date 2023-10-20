import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc      Auth user/set token
// route      POST /api/users/auth
// @access    Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password.");
  }
});

// @desc      Register a new user
// route      POST /api/users
// @access    Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    firstname,
    middlename,
    lastname,
    phonenumber,
    gender,
    birthday,
  } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists.");
  }

  const user = await User.create({
    email,
    password,
    firstname,
    middlename,
    lastname,
    phonenumber,
    gender,
    birthday,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      firstname: user.firstname,
      middlename: user.middlename,
      lastname: user.lastname,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data.");
  }
});

// @desc      Logout user
// route      POST /api/users/logout
// @access    Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "User logged out.",
  });
});

// @desc      Get user profile
// route      GET /api/users/profile
// @access    Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    email: req.user.email,
    firstname: req.user.firstname,
    middlename: req.user.middlename,
    lastname: req.user.lastname,
  }

  res.status(200).json(user);
});

// @desc      Update user profile
// route      PUT /api/users/profile
// @access    Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.email = req.body.email || user.email;
    user.firstname = req.body.firstname || user.firstname;
    user.middlename = req.body.middlename || user.middlename;
    user.lastname = req.body.lastname || user.lastname;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      middlename: updatedUser.middlename,
      lastname: updatedUser.lastname,
    });
  } else {
    res.status(404);
    throw new Error("User not found.")
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
