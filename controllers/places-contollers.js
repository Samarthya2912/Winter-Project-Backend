const HttpError = require("../models/http-error");
const uuid = require('uuid').v4;

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

const getPlaceByID = (req, res, next) => {
  const pid = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === pid);

  if (!place) {
    throw new HttpError("Could not find place for the given id.", 404);
  }

  res.json({ place });
};

const getPlaceByUserID = (req, res, next) => {
  const uid = req.params.uid;
  const places = DUMMY_PLACES.filter((place) => place.creator === uid);

  if (!places.length) {
    return next(new HttpError('Could not find any place for the given User ID.', 404));
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const { title, description, address, coordinates, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    address,
    location: coordinates,
    creator
  }

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
}

exports.getPlaceByID = getPlaceByID;
exports.getPlaceByUserID = getPlaceByUserID;
exports.createPlace = createPlace;
