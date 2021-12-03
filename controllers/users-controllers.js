const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "samarthya",
    email: "samarthya55@gmail.com",
    password: "pass123",
  },
];

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
  } catch(error) {
    return next(new HttpError(error.message, 500));
  }
};

const signup = async (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length) {
    return next(new HttpError("Invalid input", 422));
  }

  const { name, email, password, places } = req.body;

  let createdUser = new User({
    name,
    email,
    password,
    places,
    image: "https://avatars.githubusercontent.com/u/75770382?s=40&v=4",
  });

  try {
    await createdUser.save();
  } catch (error) {
    error = new HttpError(error.message, 404);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length) {
    return next(new HttpError("Invalid input", 422));
  }

  const { email, password } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email });
    if (!identifiedUser) {
      return next(new HttpError("Please signup first", 401));
    } else if (identifiedUser.password === password) {
      res.json({ message: "Logged in!!" });
    } else {
      return next(new HttpError("Wrong password", 401));
    }
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
