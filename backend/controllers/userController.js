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
      phonenumber: user.phonenumber,
      gender: user.gender,
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
      phonenumber: user.phonenumber,
      gender: user.gender
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
    firstname: user.firstname,
    middlename: user.middlename,
    lastname: user.lastname,
    email: user.email,
    phonenumber: user.phonenumber,
    gender: user.gender
  }

  res.status(200).json(user);
});

// @desc      Update user profile
// route      PUT /api/users/profile
// @access    Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstname = req.body.firstname || user.firstname;
    user.middlename = req.body.middlename || user.middlename;
    user.lastname = req.body.lastname || user.lastname;
    user.email = req.body.email || user.email;
    user.phonenumber = req.body.phonenumber || user.phonenumber;
    user.gender = req.body.gender || user.gender;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      firstname: updatedUser.firstname,
      middlename: updatedUser.middlename,
      lastname: updatedUser.lastname,
      email: updatedUser.email,
      phonenumber: updatedUser.phonenumber,
      gender: updatedUser.gender
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
