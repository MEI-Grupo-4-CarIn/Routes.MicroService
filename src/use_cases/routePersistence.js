const { RouteEntity } = require("../entities/routeEntity");
const RouteValidator = require("../validators/routeValidator");
const RouteRepository = require("../repositories/routeRepository");
const GeocodingService = require("../frameworks/geocodingService");
const RouteCalculationService = require("../frameworks/routeCalculationService");
const VehicleService = require("../frameworks/vehicleService");
const UserService = require("../frameworks/userService");
const NotFoundError = require("../utils/notFoundError");

class RoutePersistence {
  constructor() {
    this.routeRepository = new RouteRepository();
    this.geocodingService = new GeocodingService();
    this.routeCalculationService = new RouteCalculationService();
    this.vehicleService = new VehicleService();
    this.userService = new UserService();
  }

  async create(routeData) {
    // Validate the data
    const { error } = RouteValidator.validateCreate(routeData);
    if (error) {
      throw new Error(`Invalid route data: ${error.details[0].message}.`);
    }

    // Check if user exists
    await this._checkUserExistsAsync(routeData.userId);

    // Check if vehicle exists
    await this._checkVehicleExistsAsync(routeData.vehicleId);

    // Get coordinates using the geocoding service
    routeData.startPoint.coordinates = await this.geocodingService.getCoordinates(`${routeData.startPoint.city}, ${routeData.startPoint.country}`);
    routeData.endPoint.coordinates = await this.geocodingService.getCoordinates(`${routeData.endPoint.city}, ${routeData.endPoint.country}`);

    // Calculate route using the route calculation service
    const routeOptions = {
      avoidTolls: routeData.avoidTolls,
      avoidHighways: routeData.avoidHighways,
    };
    const route = await this.routeCalculationService.calculateRoute([routeData.startPoint.coordinates, routeData.endPoint.coordinates], routeOptions);

    routeData.distance = route.distance;
    routeData.duration = route.duration;
    routeData.estimatedEndDate = this._calculateEndDate(routeData.startDate, routeData.duration);

    const routeEntity = new RouteEntity(routeData);

    const validation = await routeEntity.validator();
    if (!validation.isValid) {
      throw new Error(validation.errors.join("\n"));
    }

    await this._validateUserAndVehicleAvailability(routeData);

    return this.routeRepository.create(routeEntity);
  }

  async update(id, updatedRouteData) {
    // Validate the data
    const { error } = RouteValidator.validateUpdate(updatedRouteData);
    if (error) {
      throw new Error(`Invalid route data: ${error.details[0].message}.`);
    }

    const existingRouteData = await this.routeRepository.getById(id);
    if (!existingRouteData) {
      throw new NotFoundError("Route not found.");
    }

    if (updatedRouteData.vehicleId) {
      // Check if vehicle exists
      await this._checkVehicleExistsAsync(routeData.vehicleId);
    }
    if (updatedRouteData.avoidTolls !== undefined || updatedRouteData.avoidHighways !== undefined) {
      // Recalculate route using the route calculation service
      const routeOptions = {
        avoidTolls: updatedRouteData.avoidTolls ?? existingRouteData.avoidTolls,
        avoidHighways: updatedRouteData.avoidHighways ?? existingRouteData.avoidHighways,
      };
      const route = await this.routeCalculationService.calculateRoute(
        [existingRouteData.startPoint.coordinates, existingRouteData.endPoint.coordinates],
        routeOptions
      );

      updatedRouteData.distance = route.distance;
      updatedRouteData.duration = route.duration;
      updatedRouteData.estimatedEndDate = this._calculateEndDate(updatedRouteData.startDate, updatedRouteData.duration);
    }

    const mergedRouteData = { ...existingRouteData, ...updatedRouteData };
    const route = new RouteEntity(mergedRouteData);

    const validation = await route.validator();
    if (!validation.isValid) {
      throw new Error(validation.errors.join("\n"));
    }

    await this._validateUserAndVehicleAvailability(mergedRouteData);

    return this.routeRepository.update(id, route);
  }

  async getById(id, user) {
    const route = await this.routeRepository.getById(id);
    if (!route) {
      throw new NotFoundError("Route not found.");
    }

    if (user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Driver" && user.id !== route.userId) {
      throw new Error("You do not have permission to access this route.");
    }

    return route;
  }

  async getAllRoutes(perPage, page, search, status) {
    try {
      const routes = await this.routeRepository.getAll(perPage, page, search, status);
      return routes;
    } catch (error) {
      throw new Error(`Error getting all routes: ${error.message}`);
    }
  }

  async delete(id) {
    const existingRouteData = await this.routeRepository.getById(id);
    if (!existingRouteData) {
      throw new NotFoundError("Route not found.");
    }

    await this.routeRepository.delete(id);
  }

  async recalculateRoute(eventData) {
    // Validate the data
    const { error } = RouteValidator.validateRecalculate(eventData);
    if (error) {
      throw new Error(`Invalid route data: ${error.details[0].message}.`);
    }

    let routeData = eventData.data;

    let existingRouteData = await this.routeRepository.getById(routeData.routeId);
    if (!existingRouteData) {
      throw new NotFoundError("Route not found.");
    }

    // Recalculate route using the route calculation service
    const routeOptions = {
      avoidTolls: existingRouteData.avoidTolls,
      avoidHighways: existingRouteData.avoidHighways,
    };

    const actualPositionCoordinates = await this.geocodingService.getCoordinates(routeData.actualPosition.address);
    const locationsToPassCoordinates = await Promise.all(
      routeData.locationsToPass.map((location) => this.geocodingService.getCoordinates(location.address))
    );
    const finalLocationCoordinates = await this.geocodingService.getCoordinates(routeData.finalLocation.address);

    const calculatedRoute = await this.routeCalculationService.calculateRoute(
      [actualPositionCoordinates, ...locationsToPassCoordinates, finalLocationCoordinates],
      routeOptions
    );

    existingRouteData.distance = calculatedRoute.distance;
    existingRouteData.duration = calculatedRoute.duration;
    existingRouteData.estimatedEndDate = this._calculateEndDate(existingRouteData.startDate, existingRouteData.duration);

    const route = new RouteEntity(existingRouteData);

    const validation = await route.validator();
    if (!validation.isValid) {
      throw new Error(validation.errors.join("\n"));
    }

    await this._validateUserAndVehicleAvailability(existingRouteData);

    return this.routeRepository.update(existingRouteData._id, route);
  }

  async _checkVehicleExistsAsync(vehicleId) {
    try {
      await this.vehicleService.checkVehicleExists(vehicleId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _checkUserExistsAsync(userId) {
    try {
      await this.userService.checkUserExists(userId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async _validateUserAndVehicleAvailability(routeData) {
    let existingRoutes = await this.routeRepository.find({
      $or: [
        {
          userId: routeData.userId,
          startDate: {
            $lte: routeData.estimatedEndDate,
            $gte: routeData.startDate,
          },
        },
        {
          userId: routeData.userId,
          estimatedEndDate: {
            $lte: routeData.estimatedEndDate,
            $gte: routeData.startDate,
          },
        },
        {
          vehicleId: routeData.vehicleId,
          startDate: {
            $lte: routeData.estimatedEndDate,
            $gte: routeData.startDate,
          },
        },
        {
          vehicleId: routeData.vehicleId,
          estimatedEndDate: {
            $lte: routeData.estimatedEndDate,
            $gte: routeData.startDate,
          },
        },
      ],
    });

    if (routeData._id) {
      existingRoutes = existingRoutes.filter((route) => route._id.toString() !== routeData._id.toString());
    }

    // If any routes are found, there is an overlap
    if (existingRoutes.length > 0) {
      throw new Error("There is an existing route for that user or vehicle that overlaps with the given time frame.");
    }
  }

  _calculateEndDate(startDateString, duration) {
    const durationInMilliseconds = this._durationToMilliseconds(duration);
    const startDate = new Date(startDateString);
    const endDate = new Date(startDate.getTime() + durationInMilliseconds);
    return endDate.toISOString();
  }

  _durationToMilliseconds(duration) {
    // Converts the duration on "HH:mm" format
    const [hours, minutes] = duration.split(":").map(Number);
    return (hours * 60 + minutes) * 60 * 1000;
  }
}

module.exports = RoutePersistence;
