const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const vehicleRoute = require('./interface_adapters/routes/routeRoute');

require('dotenv').config();

const uri = process.env.MONGO_URI;
mongoose.Promise = global.Promise;
mongoose.connect(uri).then(() => { 
    console.log("Successfully connected to MongoDB.");
}).catch(err => {
    console.error("MongoDB connection error", err);
}) 

app.use(express.json());
app.use('/api', routeRoute);

app.listen(port, () => {
 console.log(`Routes.MicroService listening at http://localhost:${port}`);
});
