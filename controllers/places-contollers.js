const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");

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
    return next(
      new HttpError("Could not find any place for the given User ID.", 404)
    );
  }

  res.json({ places });
};

const createPlace = (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length) {
    return next(new HttpError("Invalid input.", 422));
  }

  const { title, description, address, coordinates, creator } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    address,
    location: coordinates,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const modifyPlace = (req, res, next) => {
  const { errors } = validationResult(req);

  if(errors.length) {
    return next(new HttpError('Invalid inputs.', 422));
  }

  const pid = req.params.pid;
  const { title, description } = req.body;

  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => {
      return place.id === pid;
    }),
  };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === pid);

  if (placeIndex === -1) {
    return next(new HttpError("Could not find place with the given ID.", 404));
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const pid = req.params.pid;

  let found = false;

  for (let i = 0; i < DUMMY_PLACES.length; i++) {
    if (DUMMY_PLACES[i].id === pid) {
      DUMMY_PLACES.splice(i, 1);
      found = true;
    }
  }

  if (!found) {
    return next(new HttpError("Could not find place with the given ID.", 404));
  }

  res.status(200).json({ message: "Deleted" });
};

exports.getPlaceByID = getPlaceByID;
exports.getPlaceByUserID = getPlaceByUserID;
exports.createPlace = createPlace;
exports.modifyPlace = modifyPlace;
exports.deletePlace = deletePlace;
