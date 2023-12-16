# Routes.MicroService

This is a microservice for managing routes in a transportation system. It's built with _Node.js_ and _Express.js_, and uses _MongoDB_ for data persistence. The service provides endpoints for creating, updating, retrieving, and deleting routes.

Each route is associated with a vehicle and a user (driver), and the service verifies the existence of the vehicle and the user by making requests to the [Vehicles.MicroService](https://github.com/duartefernandes/Vehicles.MicroService) and [Auth.MicroService](https://github.com/duartefernandes/Auth.MicroService), respectively. The service also uses the [OpenRouteService API](https://openrouteservice.org) to perform geocoding actions and calculate route distances and durations.

This microservice is part of a larger project that includes other microservices and an API gateway. The other components of the project can be found at the following links:
 - [Auth.MicroService](https://github.com/duartefernandes/Auth.MicroService)
 - [Vehicles.MicroService](https://github.com/duartefernandes/Vehicles.MicroService)
 - [OcelotApiGateway](https://github.com/duartefernandes/OcelotApiGateway)

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

The server will start on port 3001, and you can make requests to the `http://localhost:3001/api` endpoint.

## Environment Variables

This project uses environment variables for configuration. To set up your local environment, follow these steps:

1. Copy the `.env.example` file and rename it to `.env`.
2. Open the `.env` file and replace the placeholder values with your actual values.

The following environment variables are used in this project:

- `MONGO_URI`: The connection string for your MongoDB database.
- `OPENROUTESERVICE_API_URL`: The base URL of the OpenRouteService API.
- `OPENROUTESERVICE_API_KEY`: Your OpenRouteService API key.
- `VEHICLE_MICROSERVICE_API_URL`: The base URL of the Vehicle.MicroService.
- `JWT_PUBLIC_KEY`: The public key used for JWT authentication.

Remember not to commit the `.env` file to the repository. This file is included in the `.gitignore` file to prevent it from being accidentally committed.

## Testing

This project has UnitTests, using the framework _Jest.js_ and they can be run with the following command:

```bash
npm test
```

## Disclaimer

This project is part of a master's degree project and is intended for educational purposes only. It should not be used in production without further development and testing.
