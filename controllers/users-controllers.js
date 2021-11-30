const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;

const DUMMY_USERS = [
  {
    id: "u1",
    name: "samarthya",
    email: "samarthya55@gmail.com",
    password: "pass123",
  },
];

const getAllUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const exisitingUser = DUMMY_USERS.find(user => user.email === email);

  if(exisitingUser) {
    return next(new HttpError('User already exists.', 422));
  }

  const newUser = {
    id: uuid(),
    name, email, password
  }

  DUMMY_USERS.push(newUser);

  res.status(201).json({ user: newUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const indentifiedUser = DUMMY_USERS.find(user => user.email === email);

  if(!indentifiedUser || indentifiedUser.password !== password) {
    return next(new HttpError('Wrong credentials', 401));
  }

  res.json({ message: 'Logged in!!' })
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
