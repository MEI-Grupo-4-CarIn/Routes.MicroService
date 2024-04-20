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
 *
 * definitions:
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
 *         type: object
 *         properties:
 *           city:
 *             type: string
 *             description: City of departure.
 *           country:
 *             type: string
 *             description: Country of departure.
 *         description: Departure location of the route.
 *       endPoint:
 *         type: object
 *         properties:
 *           city:
 *             type: string
 *             description: City of arrival.
 *           country:
 *             type: string
 *             description: Country of arrival.
 *         description: Arrival location of the route.
 *       startDate:
 *         type: string
 *         format: date-time
 *         description: Date and time of the route's start.
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
 *       endPoint:
 *         city: "CityB"
 *         country: "CountryB"
 *       startDate: "2023-01-01T12:00:00Z"
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
 * /api/routes
 *   get:
 *     tags:
 *       - Routes
 *     summary: Get all existing routes.
 *     responses:
 *       200:
 *         description: Routes obtained successfully.
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
