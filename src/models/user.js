const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First Name length should be atleast 3"],
      maxlength: 10,
    },
    lastName: {
      type: String,
      minlength: [3, "Last Name length should be atlease 3"],
      maxlength: 10,
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
      //   match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      immutable: true,
      validate: (value) => {
        if(!validator.isEmail(value)) {
            throw new Error("Invalid email address")
        };
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      validate: (value) => {
        if(!validator.isStrongPassword(value)) {
            throw new Error("Password must be strong!")
        };
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      validate: (value) => {
        if (value < 18) {
          throw new Error("Age should be equal to or greater than 18!");
        }
      },
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["male", "female", "other"],
    },
    photoUrl: {
      type: String,
      //   match: /^https?:\/\/[^\s]+$/,
      validate: (value) => {
        if(!validator.isUrl(value)) {
            throw new Error("Value must be a url!")
        };
      },
    },
    about: {
      type: String,
      maxlength: 200,
    },
    skills: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
