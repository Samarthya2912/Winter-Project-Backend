const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");
const getCoordinates = require("../utils/geocoder");
const mongoose = require("mongoose");
const Place = require("../models/place");

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

const getPlaceByID = async (req, res, next) => {
  const pid = req.params.pid;
  let place;

  try { 
    place = await Place.findById(pid);
  } catch (error) {
    error = new HttpError(error.message, 500);
    return next(error)
  }

  console.log(place);

  if (!place) {
    const error = new HttpError("Could not find place for the given id.", 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlaceByUserID = async (req, res, next) => {
  const uid = req.params.uid;
  let places;

  try {
    places = await Place.find({ creator: uid })
  } catch(error) {
    return next(new HttpError(error.message, 500));
  }

  if (!places.length) {
    return next(
      new HttpError("Could not find any place for the given User ID.", 404)
    );
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length) {
    return next(new HttpError("Invalid input.", 422));
  }

  const { title, description, address, creator } = req.body;

  const createdPlace = new Place({
    title,
    description,
    address,
    image:
      "https://bsmedia.business-standard.com/_media/bs/img/article/2021-09/20/full/1632080404-7898.jpg",
    location: getCoordinates(address),
    creator,
  });

  try {
    await createdPlace.save();
  } catch (error) {
    error = new HttpError("Could not create place, try again!", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace.map(place => place.toObject({ getters: true })) });
};

const modifyPlace = async (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length) {
    return next(new HttpError("Invalid inputs.", 422));
  }

  const pid = req.params.pid;
  const { title, description } = req.body;

  let updatedPlace;
  try {
    updatedPlace = await Place.findByIdAndUpdate(pid, { title, description }, { returnDocument: 'after' });
  } catch(error) {
    return next(new HttpError(error.message, 500));
  }

  if(!updatedPlace) {
    return next(new HttpError('Could not find any such place.', 404))
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const pid = req.params.pid;

  let deletedPlace;
  try {
    deletedPlace = await Place.findByIdAndDelete(pid);
  } catch(error) {
    return next(new HttpError(error.message, 500))
  }

  if(!deletedPlace) {
    return next(new HttpError('Could not find any such place', 404))
  }

  res.status(200).json({ place: deletedPlace.toObject({ getters: true }) });
};

exports.getPlaceByID = getPlaceByID;
exports.getPlaceByUserID = getPlaceByUserID;
exports.createPlace = createPlace;
exports.modifyPlace = modifyPlace;
exports.deletePlace = deletePlace;
