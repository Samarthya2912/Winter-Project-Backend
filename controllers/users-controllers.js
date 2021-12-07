const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  const { name, email, password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch(err) {
    return next(new HttpError(err.message, 500));
  }

  let createdUser = new User({
    name,
    email,
    password: hashedPassword,
    places: [],
    image: "https://avatars.githubusercontent.com/u/75770382?s=40&v=4",
  });

  try {
    await createdUser.save();
  } catch (error) {
    error = new HttpError(error.message, 404);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ email: createdUser.email, userId: createdUser.id }, "super_secret", { expiresIn: '1h' });
  } catch(err) {
    error = new HttpError(error.message, 404);
    return next(error);
  }

  res.status(201).json({ email: createdUser.email, userId: createdUser.id, token });
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
    }
    
    let passwordMatched = false;
    console.log(typeof identifiedUser);
    passwordMatched = await bcrypt.compare(password, identifiedUser.password);
    
    if (passwordMatched) {
      let token;
      token = jwt.sign({ email: identifiedUser.email, userId: identifiedUser.id }, "super_secret", { expiresIn: '1h' });

      res.json({ message: "Logged in!!", userId: identifiedUser.id, email: identifiedUser.email, token });
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
