const express = require('express');

const placesRoutes = require('./routes/places-routes');


const app = express();
app.use(express.urlencoded({ extended: false }))

app.use(placesRoutes);

app.listen(5000, () => { console.log('SERVER STARTED ON PORT 5000.'); })