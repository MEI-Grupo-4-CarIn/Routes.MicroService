const { RouteEntity } = require('../entities/routeEntity');
const RouteValidator = require('../validators/routeValidator');
const RouteRepository = require('../repositories/routeRepository');
const GeocodingService = require('../frameworks/geocodingService');
const RouteCalculationService = require('../frameworks/routeCalculationService');
const VehicleService = require('../frameworks/vehicleService');
const NotFoundError = require('../utils/notFoundError');

class RoutePersistence {
    constructor() {
        this.routeRepository = new RouteRepository();
        this.geocodingService = new GeocodingService();
        this.routeCalculationService = new RouteCalculationService();
        this.vehicleService = new VehicleService();
    }

    async create(routeData) {
        // Validate the data
        const { error } = RouteValidator.validateCreate(routeData);
        if (error) {
            throw new Error(`Invalid route data: ${error.details[0].message}.`);
        }

        // Check if vehicle exists
        await this._checkVehicleExistsAsync(routeData.vehicleId);

        // Get coordinates using the geocoding service
        routeData.startPoint.coordinates = await this.geocodingService.getCoordinates(`${routeData.startPoint.city}, ${routeData.startPoint.country}`);
        routeData.endPoint.coordinates = await this.geocodingService.getCoordinates(`${routeData.endPoint.city}, ${routeData.endPoint.country}`);

        // Calculate route using the route calculation service
        const routeOptions = {
            avoidTolls: routeData.avoidTolls,
            avoidHighways: routeData.avoidHighways
        };
        const route = await this.routeCalculationService.calculateRoute(
            routeData.startPoint.coordinates,
            routeData.endPoint.coordinates,
            routeOptions);

        routeData.distance = route.distance;
        routeData.duration = route.duration;

        const routeEntity = new RouteEntity(routeData);

        const validation = await routeEntity.validator();
        if (!validation.isValid) {
            throw new Error(validation.errors.join('\n'));
        }

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
            throw new NotFoundError('Route not found.');
        }

        if (updatedRouteData.vehicleId) {
            // Check if vehicle exists
            await this._checkVehicleExistsAsync(routeData.vehicleId);
        }
        if (updatedRouteData.avoidTolls !== undefined || updatedRouteData.avoidHighways !== undefined) {
            // Recalculate route using the route calculation service
            const routeOptions = {
                avoidTolls: updatedRouteData.avoidTolls ?? existingRouteData.avoidTolls,
                avoidHighways: updatedRouteData.avoidHighways ?? existingRouteData.avoidHighways
            };
            const route = await this.routeCalculationService.calculateRoute(
                existingRouteData.startPoint.coordinates,
                existingRouteData.endPoint.coordinates,
                routeOptions);

            updatedRouteData.distance = route.distance;
            updatedRouteData.duration = route.duration;
        }
    
        const mergedRouteData = { ...existingRouteData, ...updatedRouteData };
        const route = new RouteEntity(mergedRouteData);
    
        const validation = await route.validator();
        if (!validation.isValid) {
            throw new Error(validation.errors.join('\n'));
        }
    
        return this.routeRepository.update(id, route);
    }

    
    async getById(id, user) {
        const route = await this.routeRepository.getById(id);
        if (!route) {
            throw new NotFoundError('Route not found.');
        }
        
        if (user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Driver'
            && user.id !== route.userId) {
            throw new Error('You do not have permission to access this route.');
        }

        return route;
    }

    async getAllRoutes() {
        try {
            const allRoutes = await this.routeRepository.getAll();
            return allRoutes;
        } catch (error) {
            throw new Error(`Error getting all routes: ${error.message}`);
        }
    }
    
    async delete(id) {
        const existingRouteData = await this.routeRepository.getById(id);
        if (!existingRouteData) {
            throw new NotFoundError('Rota não encontrada.');
        }
    
        await this.routeRepository.delete(id);
    }
    
    async _checkVehicleExistsAsync(vehicleId) {
        try {
            await this.vehicleService.checkVehicleExists(vehicleId);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = RoutePersistence;