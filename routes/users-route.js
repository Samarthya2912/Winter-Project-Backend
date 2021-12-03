const router = require("express").Router();
const usersControllers = require("../controllers/users-controllers");
const { body } = require("express-validator");

router.get("/", usersControllers.getAllUsers);

router.post(
  "/signup",
  [
    body("name").trim().notEmpty(),
    body("email").normalizeEmail().isEmail(),
    body("password").trim().isLength({ min: 6 })
  ],
  usersControllers.signup
);

router.post(
  "/login",
  [
    body("email").normalizeEmail().isEmail(),
    body("password").trim().notEmpty(),
  ],
  usersControllers.login
);

module.exports = router;
