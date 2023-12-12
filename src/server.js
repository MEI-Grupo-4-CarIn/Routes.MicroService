const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const app = express();
const port = 3001;
require('dotenv').config({ path: __dirname + '/.env' });
const routeRoute = require('./interface_adapters/routes/routeRoute'); 

const uri = process.env.MONGO_URI;
mongoose.Promise = global.Promise;
mongoose.connect(uri).then(() => { 
    console.log("Successfully connected to MongoDB.");
}).catch(err => {
    console.error("MongoDB connection error", err);
}) 

app.use(express.json());
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use('/api', routeRoute);

app.listen(port, () => {
    console.log(`Routes.MicroService listening at http://localhost:${port}/swagger`);
});