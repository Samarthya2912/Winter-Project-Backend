const express = require("express");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-route");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  // cors headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes); // => /api/places/...
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("Route not found", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "Unknown error occured!" });
});

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    app.listen(5000, () => {
      console.log("SERVER STARTED ON PORT 5000.");
    });
  })
  .catch((err) => console.error(err));
