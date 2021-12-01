const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const placesControllers = require("../controllers/places-contollers");

router.get("/:pid", placesControllers.getPlaceByID);

router.get("/user/:uid", placesControllers.getPlaceByUserID);

router.post(
  "/",
  [
    body("title").trim().notEmpty(),
    body("description").trim().isLength({ min: 5 }),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [
    body("title").trim().notEmpty(),
    body("description").trim().isLength({ min: 5 }),
  ],
  placesControllers.modifyPlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
