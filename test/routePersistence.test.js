const RoutePersistence = require("../src/use_cases/routePersistence");
const RouteRepository = require("../src/repositories/routeRepository");
const VehicleService = require("../src/frameworks/vehicleService");
const UserService = require("../src/frameworks/userService");
const RouteCalculationService = require("../src/frameworks/routeCalculationService");
const GeocodingService = require("../src/frameworks/geocodingService");

jest.mock("../src/repositories/routeRepository");
jest.mock("../src/frameworks/vehicleService");
jest.mock("../src/frameworks/userService");
jest.mock("../src/frameworks/routeCalculationService");
jest.mock("../src/frameworks/geocodingService");

describe("RoutePersistence", () => {
  describe("create", () => {
    it("should create a route successfully", async () => {
      const mockRouteRepository = new RouteRepository();
      const mockRouteData = {
        _id: "6575ea5862568a45931aee8d",
        userId: "5",
        vehicleId: "6575972b0e7beb961ae509e9",
        startPoint: {
          city: "Braga",
          country: "Portugal",
          coordinates: [-8.415415, 41.550782],
        },
        endPoint: {
          city: "Porto",
          country: "Portugal",
          coordinates: [-8.614032, 41.16106],
        },
        startDate: "2024-12-01T00:00:00.000Z",
        estimatedEndDate: "2024-12-01T00:00:00.000Z",
        distance: 55.956,
        duration: 2672.3,
        status: "pending",
        avoidTolls: false,
        avoidHighways: false,
        isDeleted: false,
        createdAt: "2023-12-10T16:42:00.318Z",
        updatedAt: "2023-12-10T16:42:00.318Z",
        __v: 0,
      };
      mockRouteRepository.create = jest.fn().mockResolvedValue(mockRouteData);
      mockRouteRepository.find = jest.fn().mockResolvedValue([]);

      const mockUserService = new UserService();
      mockUserService.checkUserExists = jest.fn().mockResolvedValue();

      const mockVehicleService = new VehicleService();
      mockVehicleService.checkVehicleExists = jest.fn().mockResolvedValue();

      const mockRouteCalculationService = new RouteCalculationService();
      const mockRouteCalculationData = {
        distance: 55.956,
        duration: "00:44",
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
        userId: "5",
        vehicleId: "6575972b0e7beb961ae509e9",
        startPoint: {
          city: "Braga",
          country: "Portugal",
        },
        endPoint: {
          city: "Porto",
          country: "Portugal",
        },
        startDate: "2024-12-01",
        status: "pending",
        avoidTolls: false,
        avoidHighways: false,
      };

      const route = await routePersistence.create(routeData);
      expect(route).toEqual(mockRouteData);
    });

    it("should throw an error if the route data is invalid", async () => {
      const routePersistence = new RoutePersistence();

      const invalidRouteData = {
        userId: 123, // should be a string, not a number
        vehicleId: "", // should not be an empty string
        startPoint: {
          city: "Braga",
          country: "Portugal",
        },
        // missing endPoint
        startDate: "2024-13-01", // invalid date
        status: "unknown", // invalid status
        avoidTolls: "false", // should be a boolean, not a string
        avoidHighways: "false", // should be a boolean, not a string
      };

      await expect(routePersistence.create(invalidRouteData)).rejects.toThrow();
    });

    const overlappingUserRoutes = [
      {
        _id: "6575ea5862568a45931aee8d",
        userId: "5",
        vehicleId: "6575972b0e7beb961ae509e9",
        startPoint: {
          city: "Braga",
          country: "Portugal",
          coordinates: [-8.415415, 41.550782],
        },
        endPoint: {
          city: "Porto",
          country: "Portugal",
          coordinates: [-8.614032, 41.16106],
        },
        startDate: "2023-01-01T00:00:00Z",
        estimatedEndDate: "2023-01-02T00:00:00Z",
        distance: 55.956,
        duration: 2672.3,
        status: "pending",
        avoidTolls: false,
        avoidHighways: false,
        isDeleted: false,
        createdAt: "2023-12-10T16:42:00.318Z",
        updatedAt: "2023-12-10T16:42:00.318Z",
        __v: 0,
      },
      {
        _id: "6575ea5862568a45931abd8d",
        userId: "5",
        vehicleId: "6575972b0e7beb961ae509a8",
        startPoint: {
          city: "Braga",
          country: "Portugal",
          coordinates: [-8.415415, 41.550782],
        },
        endPoint: {
          city: "Porto",
          country: "Portugal",
          coordinates: [-8.614032, 41.16106],
        },
        startDate: "2023-01-01T00:00:00Z",
        estimatedEndDate: "2023-01-02T00:00:00Z",
        distance: 55.956,
        duration: 2672.3,
        status: "pending",
        avoidTolls: false,
        avoidHighways: false,
        isDeleted: false,
        createdAt: "2023-12-10T16:42:00.318Z",
        updatedAt: "2023-12-10T16:42:00.318Z",
        __v: 0,
      },
    ];

    const overlappingVehicleRoutes = [
      {
        _id: "6575ea5862568a45931abf8d",
        userId: "2",
        vehicleId: "6575972b0e7beb961ae509e9",
        startPoint: {
          city: "Braga",
          country: "Portugal",
          coordinates: [-8.415415, 41.550782],
        },
        endPoint: {
          city: "Porto",
          country: "Portugal",
          coordinates: [-8.614032, 41.16106],
        },
        startDate: "2023-01-01T00:00:00Z",
        estimatedEndDate: "2023-01-02T00:00:00Z",
        distance: 55.956,
        duration: 2672.3,
        status: "pending",
        avoidTolls: false,
        avoidHighways: false,
        isDeleted: false,
        createdAt: "2023-12-10T16:42:00.318Z",
        updatedAt: "2023-12-10T16:42:00.318Z",
        __v: 0,
      },
      {
        _id: "6575ea5862568a45931aee8d",
        userId: "5",
        vehicleId: "6575972b0e7beb961ae509e9",
        startPoint: {
          city: "Braga",
          country: "Portugal",
          coordinates: [-8.415415, 41.550782],
        },
        endPoint: {
          city: "Porto",
          country: "Portugal",
          coordinates: [-8.614032, 41.16106],
        },
        startDate: "2023-01-01T00:00:00Z",
        estimatedEndDate: "2023-01-02T00:00:00Z",
        distance: 55.956,
        duration: 2672.3,
        status: "pending",
        avoidTolls: false,
        avoidHighways: false,
        isDeleted: false,
        createdAt: "2023-12-10T16:42:00.318Z",
        updatedAt: "2023-12-10T16:42:00.318Z",
        __v: 0,
      },
    ];

    it("should throw an error if there is an existing route that overlaps with the given time frame based on userId", async () => {
      const routeData = {
        _id: "6575ea5862568a45931aee8d",
        userId: "5",
        vehicleId: "6575972b0e7beb961ae509e9",
        startPoint: {
          city: "Braga",
          country: "Portugal",
          coordinates: [-8.415415, 41.550782],
        },
        endPoint: {
          city: "Porto",
          country: "Portugal",
          coordinates: [-8.614032, 41.16106],
        },
        startDate: "2023-01-01T00:00:00Z",
        estimatedEndDate: "2023-01-02T00:00:00Z",
        distance: 55.956,
        duration: 2672.3,
        status: "pending",
        avoidTolls: false,
        avoidHighways: false,
        isDeleted: false,
        createdAt: "2023-12-10T16:42:00.318Z",
        updatedAt: "2023-12-10T16:42:00.318Z",
        __v: 0,
      };

      const mockRouteRepository = new RouteRepository();
      mockRouteRepository.find = jest.fn().mockResolvedValue(overlappingUserRoutes);

      const routePersistence = new RoutePersistence();
      routePersistence.routeRepository = mockRouteRepository;

      await expect(routePersistence._validateUserAndVehicleAvailability(routeData)).rejects.toThrow(
        "There is an existing route for that user or vehicle that overlaps with the given time frame."
      );
    });

    it("should throw an error if there is an existing route that overlaps with the given time frame based on vehicleId", async () => {
      const routeData = {
        _id: "6575ea5862568a45931aee8d",
        userId: "2",
        vehicleId: "6575972b0e7beb961ae509e9",
        startPoint: {
          city: "Braga",
          country: "Portugal",
          coordinates: [-8.415415, 41.550782],
        },
        endPoint: {
          city: "Porto",
          country: "Portugal",
          coordinates: [-8.614032, 41.16106],
        },
        startDate: "2023-01-01T00:00:00Z",
        estimatedEndDate: "2023-01-02T00:00:00Z",
        distance: 55.956,
        duration: 2672.3,
        status: "pending",
        avoidTolls: false,
        avoidHighways: false,
        isDeleted: false,
        createdAt: "2023-12-10T16:42:00.318Z",
        updatedAt: "2023-12-10T16:42:00.318Z",
        __v: 0,
      };

      const mockRouteRepository = new RouteRepository();
      mockRouteRepository.find = jest.fn().mockResolvedValue(overlappingVehicleRoutes);

      const routePersistence = new RoutePersistence();
      routePersistence.routeRepository = mockRouteRepository;

      await expect(routePersistence._validateUserAndVehicleAvailability(routeData)).rejects.toThrow(
        "There is an existing route for that user or vehicle that overlaps with the given time frame."
      );
    });
  });

  describe("update", () => {
    it("should update a route successfully", async () => {
      const mockRouteRepository = new RouteRepository();

      const existingRouteData = {
        _id: "6575ea5862568a45931aee8d",
        userId: "5",
        vehicleId: "6575972b0e7beb961ae509e9",
        startPoint: {
          city: "Braga",
          country: "Portugal",
          coordinates: [-8.415415, 41.550782],
        },
        endPoint: {
          city: "Porto",
          country: "Portugal",
          coordinates: [-8.614032, 41.16106],
        },
        startDate: "2024-12-01T00:00:00.000Z",
        distance: 55.956,
        duration: 2672.3,
        status: "pending",
        avoidTolls: false,
        avoidHighways: false,
        isDeleted: false,
        createdAt: "2023-12-10T16:42:00.318Z",
        updatedAt: "2023-12-10T16:42:00.318Z",
        __v: 0,
      };
      mockRouteRepository.getById = jest.fn().mockResolvedValue(existingRouteData);

      const updatedRouteData = {
        _id: "6575ea5862568a45931aee8d",
        userId: "5",
        vehicleId: "6575972b0e7beb961ae509e9",
        startPoint: {
          city: "Braga",
          country: "Portugal",
          coordinates: [-8.415415, 41.550782],
        },
        endPoint: {
          city: "Porto",
          country: "Portugal",
          coordinates: [-8.614032, 41.16106],
        },
        startDate: "2024-12-01T00:00:00.000Z",
        distance: 55.956,
        duration: 2672.3,
        status: "completed",
        avoidTolls: false,
        avoidHighways: false,
        isDeleted: false,
        createdAt: "2023-12-10T16:42:00.318Z",
        updatedAt: "2023-12-10T16:42:00.318Z",
        __v: 0,
      };
      mockRouteRepository.update = jest.fn().mockResolvedValue(updatedRouteData);
      mockRouteRepository.find = jest.fn().mockResolvedValue([]);

      const mockUserService = new UserService();
      mockUserService.checkUserExists = jest.fn().mockResolvedValue();

      const mockVehicleService = new VehicleService();
      mockVehicleService.checkVehicleExists = jest.fn().mockResolvedValue();

      const mockRouteCalculationService = new RouteCalculationService();
      const mockRouteCalculationData = {
        distance: 55.956,
        duration: "00:44",
      };
      mockRouteCalculationService.calculateRoute = jest.fn().mockResolvedValue(mockRouteCalculationData);

      const mockGeocodingService = new GeocodingService();
      mockGeocodingService.getCoordinates = jest.fn().mockResolvedValue([-8.415415, 41.550782]);

      const routePersistence = new RoutePersistence();
      routePersistence.routeRepository = mockRouteRepository;
      routePersistence.vehicleService = mockVehicleService;
      routePersistence.routeCalculationService = mockRouteCalculationService;
      routePersistence.geocodingService = mockGeocodingService;

      const routeDataForUpdate = {
        status: "completed",
      };

      const route = await routePersistence.update("6575ea5862568a45931aee8d", routeDataForUpdate);
      expect(route).toEqual(updatedRouteData);
    });

    it("should throw an error if the route data is invalid", async () => {
      const routePersistence = new RoutePersistence();

      const invalidRouteData = {
        status: "unknown", // invalid status
        endPoint: {
          // not allowed object for update
          city: "Lisboa",
          country: "Portugal",
          coordinates: [-8.614032, 41.16106],
        },
      };

      await expect(routePersistence.update("6575ea5862568a45931aee8d", invalidRouteData)).rejects.toThrow();
    });
  });
});
