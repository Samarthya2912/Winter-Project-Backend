const express = require("express");

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
    const error = new Error("Could not find place for the given id.");
    error.code = 404;
    throw error;
  }

  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const uid = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === uid);

  if (!places.length) {
    const error = new Error('Could not find places for the given user id.');
    error.code = 404;
    return next(error);
  }

  res.json({ places });
});

module.exports = router;
