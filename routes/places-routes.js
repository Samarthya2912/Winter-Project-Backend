const express = require("express");
const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the tallest buidings in the world!",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const pid = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === pid);

  if (!place) {
    throw HttpError("Could not find place for the given id.", 404);
  }

  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const uid = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === uid);

  if (!places.length) {
    return next(HttpError('Could not find places for the given user id.', 404));
  }

  res.json({ places });
});

module.exports = router;
