const HttpError = require("../models/http-error");
const uuid = require("uuid").v4;
const { validationResult } = require("express-validator");
const getCoordinates = require("../utils/geocoder");
const mongoose = require("mongoose");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceByID = async (req, res, next) => {
  const pid = req.params.pid;
  let place;

  try {
    place = await Place.findById(pid);
  } catch (error) {
    error = new HttpError(error.message, 500);
    return next(error);
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
    places = await Place.find({ creator: uid });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }

  if (!places.length) {
    return res.json({ places: [] })
  }

  // let identifiedUser;
  // try {
  //   identifiedUser = await User.findById(uid).populate('places');
  // } catch(error) {
  //   return next(new HttpError(error.message, 500));
  // }
  
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
  // res.json({ places: identifiedUser.places.map(place => place.toObject({ getters: true })) });
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
    creator,
    location: getCoordinates(address),
    image:
      "https://bsmedia.business-standard.com/_media/bs/img/article/2021-09/20/full/1632080404-7898.jpg",
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }

  if (!user) {
    return next(
      new HttpError("Could not find a user for the given user id.", 404)
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    await user.places.push(createdPlace);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }

  res
    .status(201)
    .json({
      place: createdPlace.toObject({ getters: true }),
    });
};

const modifyPlace = async (req, res, next) => {
  const { errors } = validationResult(req);

  if (errors.length) {
    return next(new HttpError("Invalid inputs.", 422));
  }

  const pid = req.params.pid;
  const { title, address, description } = req.body;

  let updatedPlace;
  try {
    updatedPlace = await Place.findByIdAndUpdate(
      pid,
      { title, description, address },
      { returnDocument: "after" }
    );
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }

  if (!updatedPlace) {
    return next(new HttpError("Could not find any such place.", 404));
  }

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const pid = req.params.pid;

  let identifiedPlace;
  try {
    identifiedPlace = await Place.findById(pid);
    await identifiedPlace.populate('creator');
  } catch(error) {
    return next(new HttpError(error.message, 500));
  }

  if(!identifiedPlace) {
    return next(new HttpError('No such place exists.', 404));
  }

  let deletedPlace;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    identifiedPlace.remove({ session: sess });
    identifiedPlace.creator.places.pull(identifiedPlace);
    identifiedPlace.creator.save({ session: sess });
    sess.commitTransaction();
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }

  res.status(200).json({ place: identifiedPlace.toObject({ getters: true }) });
};

exports.getPlaceByID = getPlaceByID;
exports.getPlaceByUserID = getPlaceByUserID;
exports.createPlace = createPlace;
exports.modifyPlace = modifyPlace;
exports.deletePlace = deletePlace;
