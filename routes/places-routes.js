const express = require("express");
const router = express.Router();

const placesControllers = require('../controllers/places-contollers');

router.get("/:pid", placesControllers.getPlaceByID);

router.get("/user/:uid", placesControllers.getPlaceByUserID);

router.post("/", placesControllers.createPlace);

router.patch("/:pid", placesControllers.modifyPlace);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
