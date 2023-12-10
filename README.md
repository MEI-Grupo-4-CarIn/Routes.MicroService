# Routes.MicroService

This is a microservice for managing routes in a transportation system. It's built with Node.js and Express.js, and uses MongoDB for data persistence. The service provides endpoints for creating, updating, retrieving, and deleting routes.

Each route is associated with a vehicle, and the service verifies the existence of the vehicle by making requests to the Vehicle.MicroService. The service also uses the OpenRouteService API to calculate route distances and durations.

## Getting Started

To get started with this project, clone the repository and install the dependencies:

```bash
git clone https://github.com/Rafa26Azevedo/Routes.MicroService.git
cd Routes.MicroService
npm install
```

Next, set up your environment variables by following the instructions in the [Environment Variables](#environment-variables) section.

Finally, start the server:

```bash
npm start
```

The server will start on port 3001 (or the port specified in your `.env` file), and you can make requests to the `http://localhost:3001/api` endpoint.

## Environment Variables

This project uses environment variables for configuration. To set up your local environment, follow these steps:

1. Copy the `.env.example` file and rename it to `.env`.
2. Open the `.env` file and replace the placeholder values with your actual values.

## Environment Variables

The following environment variables are used in this project:

- `MONGO_URI`: The connection string for your MongoDB database.
- `OPENROUTESERVICE_API_URL`: The base URL of the OpenRouteService API.
- `OPENROUTESERVICE_API_KEY`: Your OpenRouteService API key.
- `VEHICLE_MICROSERVICE_API_URL`: The base URL of the Vehicle.MicroService.

Remember not to commit the `.env` file to the repository. This file is included in the `.gitignore` file to prevent it from being accidentally committed.