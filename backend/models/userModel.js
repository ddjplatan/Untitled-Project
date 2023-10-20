import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "An email is required!"],
      unique: [
        true,
        "The email has already been registered, try to login please!",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password!"],
    },
    firstname: {
      type: String,
      required: [true, "Please input your first name!"],
      trim: true,
      maxlength: [100, "First name is too long"],
    },
    middlename: {
      type: String,
      trim: true,
      maxLength: [50, "Middle name is too long"],
    },
    lastname: {
      type: String,
      required: [true, "Please input your last name!"],
      trim: true,
      maxlength: [50, "Last name is too long"],
    },
    phonenumber: {
      type: String,
      required: [true, "Please enter your phone number!"],
      unique: [true, "Phone number already taken!"],
    },
    gender: {
      type: String,
      required: [true, "Please add a gender!"],
      enum: ["Male", "Female", "Other"],
    },
    birthday: {
      type: Date,
      min: "1980-01-01",
      max: eighteenYearsAgo,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
