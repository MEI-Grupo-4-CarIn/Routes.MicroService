const express = require("express");
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const fs = require("fs");
const path = require("path");
const app = express();

const port = 3001;

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

const routeRoute = require("./interface_adapters/routes/routeRoute");
const { subscribeToQueue } = require("./frameworks/rabbitmq");

const uri = process.env.MONGO_URI;
mongoose.Promise = global.Promise;
mongoose
  .connect(uri)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });

app.use(express.json());
app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/api", routeRoute);

// RabbitMQ Subscriptions
subscribeToQueue("ROUTES_Recalculate");

app.listen(port, () => {
  console.log(
    `Routes.MicroService listening at http://localhost:${port}/swagger`,
  );
});
