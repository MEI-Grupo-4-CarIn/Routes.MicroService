const RoutePersistence = require("../../use_cases/routePersistence");
const NotFoundError = require("../../utils/notFoundError");
const Logger = require("../../frameworks/logging/logger");
const { publishToQueue } = require("../../frameworks/rabbitmq");

class RouteController {
  constructor() {
    this.routePersistence = new RoutePersistence();
  }

  async createRoute(req, res) {
    try {
      const route = await this.routePersistence.create(req.body);
      Logger.info(
        `Route created by the user '${req.user.email}' with success! Info: routeId: '${route.id}' for userId: '${route.userId}' and vehicleId: '${route.vehicleId}'.`
      );

      // Publish a notification message to the notificationQueue
      const notificationMessage = JSON.stringify({
        userId: route.userId,
        title: "New Route Created",
        body: `A new route for you has been created with the ID ${route.id}.`,
      });
      publishToQueue("notificationQueue", notificationMessage);

      res.status(201).json(route);
    } catch (error) {
      Logger.error(`Error creating route:`, error);
      res.status(400).json({ message: error.message });
    }
  }

  async updateRoute(req, res) {
    try {
      const { id } = req.params;

      const updatedRoute = await this.routePersistence.update(id, req.body);
      Logger.info(`Route '${id}' successfully updated by the user '${req.user.email}'.`);
      res.status(200).json(updatedRoute);
    } catch (error) {
      Logger.error(`Error updating the route '${req.params.id}':`, error);
      res.status(400).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = req.user;

      const route = await this.routePersistence.getById(id, user);
      res.status(200).json(route);
    } catch (error) {
      Logger.error(`Error obtaining the route '${req.params.id}':`, error);
      if (error instanceof NotFoundError) {
        return res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async getAllRoutes(req, res) {
    try {
      let { perPage = 10, page = 1, search, status, userId, vehicleId } = req.query;
      const user = req.user;

      const result = await this.routePersistence.getAllRoutes(perPage, page, search, status, userId, vehicleId, user);

      res.status(200).json(result);
    } catch (error) {
      Logger.error(`Error obtaining routes list:`, error);
      res.status(500).json({ message: error.message });
    }
  }

  async deleteRoute(req, res) {
    try {
      const { id } = req.params;

      await this.routePersistence.delete(id);
      Logger.info(`Route '${id}' deleted by the user '${req.user.email}'.`);
      res.status(204).send();
    } catch (error) {
      Logger.error(`Error deleting the route '${req.params.id}':`, error);
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = RouteController;
