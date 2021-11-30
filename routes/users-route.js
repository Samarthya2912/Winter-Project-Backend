const router = require('express').Router();
const usersControllers = require('../controllers/users-controllers');

router.get("/", usersControllers.getAllUsers);

router.post("/signup", usersControllers.signup);

router.post("/login", usersControllers.login);

module.exports = router;