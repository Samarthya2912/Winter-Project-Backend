const express = require("express");

const placesRoutes = require("./routes/places-routes");
// const usersRoutes = require('./routes/users-route');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/places", placesRoutes); // => /api/places/...
// app.use("/api/users", usersRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "Unknown error occured!" });
});

app.listen(5000, () => {
  console.log("SERVER STARTED ON PORT 5000.");
});
