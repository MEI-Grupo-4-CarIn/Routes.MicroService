const express = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const RouteController = require("../controllers/routeController");

const router = express.Router();
const routeController = new RouteController();

/**
 * @swagger
 * tags:
 *   name: Routes
 *   description: Operations related to routes
 * definitions:
 *   Location:
 *     type: object
 *     properties:
 *       city:
 *         type: string
 *         description: City name
 *       country:
 *         type: string
 *         description: Country name
 *       coordinates:
 *         type: array
 *         items:
 *           type: number
 *         description: >
 *           [longitude, latitude] coordinates
 *
 *   Route:
 *     type: object
 *     properties:
 *       userId:
 *         type: string
 *         description: ID of the user responsible for the route.
 *       vehicleId:
 *         type: string
 *         description: ID of the vehicle associated with the route.
 *       startPoint:
 *         $ref: '#/definitions/Location'
 *         description: Departure location of the route.
 *       endPoint:
 *         $ref: '#/definitions/Location'
 *         description: Arrival location of the route.
 *       startDate:
 *         type: string
 *         format: date-time
 *         description: Date and time of the route's start.
 *       estimatedEndDate:
 *         type: string
 *         format: date-time
 *         description: Estimated date and time of the route's end.
 *       distance:
 *         type: number
 *         description: Distance of the route.
 *       duration:
 *         type: string
 *         description: Duration of the route.
 *       status:
 *         type: string
 *         enum: [pending, inProgress, completed, cancelled]
 *         description: Status of the route.
 *       avoidTolls:
 *         type: boolean
 *         description: Indicates whether the route should avoid tolls.
 *       avoidHighways:
 *         type: boolean
 *         description: Indicates whether the route should avoid highways.
 *     example:
 *       userId: "123"
 *       vehicleId: "456"
 *       startPoint:
 *         city: "CityA"
 *         country: "CountryA"
 *         coordinates: [0, 0]
 *       endPoint:
 *         city: "CityB"
 *         country: "CountryB"
 *         coordinates: [1, 1]
 *       startDate: "2023-01-01T12:00:00Z"
 *       estimatedEndDate: "2023-01-02T12:00:00Z"
 *       distance: 100
 *       duration: "2 hours"
 *       status: "pending"
 *       avoidTolls: true
 *       avoidHighways: false
 */

/**
 * @swagger
 * /api/routes:
 *   post:
 *     tags:
 *       - Routes
 *     summary: Create new route.
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Route'
 *     responses:
 *       201:
 *         description: Route created successfully.
 *         schema:
 *           $ref: '#/definitions/Route'
 *       400:
 *         description: Error creating the route.
 */
router.post("/routes", authMiddleware(["Admin", "Manager"]), (req, res) => routeController.createRoute(req, res));

/**
 * @swagger
 * /api/routes/{id}:
 *   patch:
 *     tags:
 *       - Routes
 *     summary: Update an existing route by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the route to be updated.
 *         type: string
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Route'
 *     responses:
 *       200:
 *         description: Route updated successfully.
 *         schema:
 *           $ref: '#/definitions/Route'
 *       404:
 *         description: Route not found.
 *       400:
 *         description: Error updating the route.
 */
router.patch("/routes/:id", authMiddleware(["Admin", "Manager"]), (req, res) => routeController.updateRoute(req, res));

/**
 * @swagger
 * /api/routes/{id}:
 *   get:
 *     tags:
 *       - Routes
 *     summary: Get an existing route by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the route to be obtained.
 *         type: string
 *     responses:
 *       200:
 *         description: Route obtained successfully.
 *         schema:
 *           $ref: '#/definitions/Route'
 *       404:
 *         description: Route not found.
 *       400:
 *         description: Error obtaining the route.
 */
router.get("/routes/:id", authMiddleware(["Admin", "Manager", "Driver"]), (req, res) => routeController.getById(req, res));

/**
 * @swagger
 * /routes:
 *   get:
 *     tags:
 *       - Routes
 *     summary: Retrieve all routes with pagination, search, and status filter.
 *     parameters:
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of routes per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter routes
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, inProgress, completed, cancelled]
 *         description: Status to filter routes
 *     responses:
 *       200:
 *         description: A list of routes.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Route'
 *       400:
 *         description: Invalid query parameters.
 *       500:
 *         description: Error retrieving routes.
 */
router.get("/routes", authMiddleware(["Admin", "Manager"]), (req, res) => routeController.getAllRoutes(req, res));

/**
 * @swagger
 * /api/routes/{id}:
 *   delete:
 *     tags:
 *       - Routes
 *     summary: Delete and existing route by id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the route to be deleted.
 *         type: string
 *     responses:
 *       204:
 *         description: Route deleted successfully.
 *       404:
 *         description: Route not found.
 *       400:
 *         description: Error deleting the route.
 */
router.delete("/routes/:id", authMiddleware(["Admin", "Manager"]), (req, res) => routeController.deleteRoute(req, res));

module.exports = router;
