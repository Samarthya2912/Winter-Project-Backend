const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;

const DUMMY_USERS = [{}];

const getAllUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {};

const login = (req, res, next) => {};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
