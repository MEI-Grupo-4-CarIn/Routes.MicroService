const { RouteEntity } = require('../entities/routeEntity');
const routeSchema = require('../validators/routeValidator');
const RouteRepository = require('../repositories/routeRepository');
const GeocodingService = require('../frameworks/geocodingService');
const RouteCalculationService = require('../frameworks/routeCalculationService');
const NotFoundError = require('../utils/notFoundError');

class RoutePersistence {
    constructor() {
        this.routeRepository = new RouteRepository();
        this.geocodingService = new GeocodingService();
        this.routeCalculationService = new RouteCalculationService();
    }

    async create(routeData) {
        // Validate the data
        const { error } = routeSchema.validate(routeData);
        if (error) {
            throw new Error(`Invalid route data: ${error.details[0].message}`);
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
}

module.exports = RoutePersistence;