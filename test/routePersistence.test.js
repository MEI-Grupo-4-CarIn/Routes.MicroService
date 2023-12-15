const RoutePersistence = require('../src/use_cases/routePersistence');
const RouteRepository = require('../src/repositories/routeRepository');
const VehicleService = require('../src/frameworks/vehicleService');
const RouteCalculationService = require('../src/frameworks/routeCalculationService');
const GeocodingService = require('../src/frameworks/geocodingService');

jest.mock('../src/repositories/routeRepository');
jest.mock('../src/frameworks/vehicleService');
jest.mock('../src/frameworks/routeCalculationService');
jest.mock('../src/frameworks/geocodingService');

describe('RoutePersistence', () => {
    describe('create', () => {
        it('should create a route successfully', async () => {
            const mockRouteRepository = new RouteRepository();
            const mockRouteData = {
                "_id": "6575ea5862568a45931aee8d",
                "userId": "5",
                "vehicleId": "6575972b0e7beb961ae509e9",
                "startPoint": {
                    "city": "Braga",
                    "country": "Portugal",
                    "coordinates": [-8.415415, 41.550782]
                },
                "endPoint": {
                    "city": "Porto",
                    "country": "Portugal",
                    "coordinates": [-8.614032, 41.16106]
                },
                "startDate": "2024-12-01T00:00:00.000Z",
                "distance": 55.956,
                "duration": 2672.3,
                "status": "pending",
                "avoidTolls": false,
                "avoidHighways": false,
                "createdAt": "2023-12-10T16:42:00.318Z",
                "updatedAt": "2023-12-10T16:42:00.318Z",
                "__v": 0
            };
            mockRouteRepository.create = jest.fn().mockResolvedValue(mockRouteData);

            const mockVehicleService = new VehicleService();
            mockVehicleService.checkVehicleExists = jest.fn().mockResolvedValue();

            const mockRouteCalculationService = new RouteCalculationService();
            const mockRouteCalculationData = {
                distance: 55.956,
                duration: 2672.3
            };
            mockRouteCalculationService.calculateRoute = jest.fn().mockResolvedValue(mockRouteCalculationData);

            const mockGeocodingService = new GeocodingService();
            mockGeocodingService.getCoordinates = jest.fn().mockResolvedValue([-8.415415, 41.550782]);

            const routePersistence = new RoutePersistence();
            routePersistence.routeRepository = mockRouteRepository;
            routePersistence.vehicleService = mockVehicleService;
            routePersistence.routeCalculationService = mockRouteCalculationService;
            routePersistence.geocodingService = mockGeocodingService;

            const routeData = {
                "userId": "5",
                "vehicleId": "6575972b0e7beb961ae509e9",
                "startPoint": {
                    "city": "Braga",
                    "country": "Portugal"
                },
                "endPoint": {
                    "city": "Porto",
                    "country": "Portugal"
                },
                "startDate": "2024-12-01",
                "status": "pending",
                "avoidTolls": false,
                "avoidHighways": false
            };

            const route = await routePersistence.create(routeData);
            expect(route).toEqual(mockRouteData);
        });

        it('should throw an error if the route data is invalid', async () => {
            const routePersistence = new RoutePersistence();

            const invalidRouteData = {
                "userId": 123, // should be a string, not a number
                "vehicleId": "", // should not be an empty string
                "startPoint": {
                    "city": "Braga",
                    "country": "Portugal"
                },
                // missing endPoint
                "startDate": "2024-13-01", // invalid date
                "status": "unknown", // invalid status
                "avoidTolls": "false", // should be a boolean, not a string
                "avoidHighways": "false" // should be a boolean, not a string
            };

            await expect(routePersistence.create(invalidRouteData)).rejects.toThrow();
        });

        // ... other tests for other cases
    });

    // ... other tests for other methods
});