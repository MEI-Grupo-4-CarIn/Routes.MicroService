const { RouteEntity } = require('../entities/routeEntity');
const routeSchema = require('../validators/routeValidator');
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
        const { error } = routeSchema.validate(routeData);
        if (error) {
            throw new Error(`Invalid route data: ${error.details[0].message}.`);
        }

        // Check if vehicle exists
        try {
            await this.vehicleService.checkVehicleExists(routeData.vehicleId);
        } catch (error) {
            throw new Error(error.message);
        }

        // Get coordinates using the geocoding service
        const startPointCoordinates = await this.geocodingService.getCoordinates(`${routeData.startPoint.city}, ${routeData.startPoint.country}`);
        const endPointCoordinates = await this.geocodingService.getCoordinates(`${routeData.endPoint.city}, ${routeData.endPoint.country}`);

        // Calculate route using the route calculation service
        const routeOptions = {
            avoidTolls: routeData.avoidTolls,
            avoidHighways: routeData.avoidHighways
        };
        const route = await this.routeCalculationService.calculateRoute(startPointCoordinates, endPointCoordinates, routeOptions);
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
        const existingRouteData = await this.routeRepository.getById(id);
        if (!existingRouteData) {
            throw new NotFoundError('Route not found.');
        }
    
        const mergedRouteData = { ...existingRouteData, ...updatedRouteData };
        const route = new RouteEntity(mergedRouteData);
    
        const validation = await route.validator();
        if (!validation.isValid) {
            throw new Error(validation.errors.join('\n'));
        }
    
        return this.routeRepository.update(id, route);
    }

    
    async getById(id) {
        const route = await this.routeRepository.getById(id);
        if (!route) {
            throw new NotFoundError('Route not found.');
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
    
}

module.exports = RoutePersistence;