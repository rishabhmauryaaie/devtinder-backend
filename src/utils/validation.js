const { default: mongoose } = require("mongoose");
const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name required!");
  } else if (firstName.length < 3 || lastName.length < 3) {
    throw new Error(
      "First name and last name length should be greater than 3!",
    );
  }

  if (!emailId) {
    throw new Error("Email id is required to register new user!");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email id!");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong!");
  }

  if (!age) {
    throw new Error("Age should be required");
  } else if (age < 18) {
    throw new Error("Age must be equal or above 18!");
  }

  if (!gender) {
    throw new Error("Gender is required!");
  } else if (!["male", "female", "other"].includes(gender.toLowerCase())) {
    throw new Error("Invalid Gender!");
  }
};

const validateLoginData = (req) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    throw new Error("Invalid Credentials!");
  }

  if (!password) {
    throw new Error("Invalid credentials!");
  }
};

const validateEditProfileData = (req) => {
  const data = req.body;
  const ALLOWED_DATA = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
  ];

  let result = false;

  for (let d in data) {
    result = ALLOWED_DATA.includes(d);

    if (!result) {
      throw new Error("Invalid Data!");
    }
  }
};

const validatePasswordProfileData = (req) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword) {
    throw new Error("Old password must required to update password!");
  }

  if (!newPassword) {
    throw new Error("New Password must required!");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("Password is not strong!");
  }
};

const validateConnectionRequestData = (req) => {
  const { toUserId, status } = req.params;

  console.log(toUserId, status);

  if (!toUserId) {
    throw new Error("User id required to make connection!");
  }

  if (!status) {
    throw new Error("Status must be required!");
  }

  if (!["interested", "ignored"].includes(status)) {
    throw new Error("Invalid status!");
  }
};

const validateReviewRequestData = (req) => {
  const { status, requestId } = req.params;

  if (!status) {
    throw new Error("Status is required!");
  }

  if (!["accepted", "rejected"].includes(status)) {
    throw new Error("Invalid status!");
  }

  if (!requestId) {
    throw new Error("Request id must be required!");
  }

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    throw new Error("Invalid request Id!");
  }
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateEditProfileData,
  validatePasswordProfileData,
  validateConnectionRequestData,
  validateReviewRequestData,
};
