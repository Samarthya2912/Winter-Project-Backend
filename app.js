const express = require('express');

const placesRoutes = require('./routes/places-routes');
// const usersRoutes = require('./routes/users-route');

const app = express();
app.use(express.urlencoded({ extended: false }))

app.use("/api/places", placesRoutes); // => /api/places/...
// app.use("/api/users", usersRoutes);

app.listen(5000, () => { console.log('SERVER STARTED ON PORT 5000.'); });