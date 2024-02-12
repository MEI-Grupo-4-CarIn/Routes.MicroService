const RoutePersistence = require('../../use_cases/routePersistence');
const NotFoundError = require('../../utils/notFoundError');
const Logger = require('../../frameworks/logging/logger');

class RouteController {
    constructor() {
        this.routePersistence = new RoutePersistence();
    }

    async createRoute(req, res) {
        try {
            const route = await this.routePersistence.create(req.body);
            Logger.info(`Route created by the user '${req.user.email}' with success! Info: routeId: '${route.id}' for userId: '${route.userId}' and vehicleId: '${route.vehicleId}'.`);
            res.status(201).json(route);
        } catch (error) {
            Logger.error('Error creating route: ' + error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async updateRoute(req, res) {
        try {
            const { id } = req.params;
            const updatedRoute = await this.routePersistence.update(id, req.body);
            Logger.info(`Route '${id}' successfully updated by the user '${req.user.email}'.`)
            res.status(200).json(updatedRoute);
        } catch (error) {
            Logger.error(`Error updating route '${req.params.id}': ${error.message}`);
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
            Logger.error(`Error obtaining route '${req.params.id}': ${error.message}`);
            if (error instanceof NotFoundError) {
                return res.status(404).json({ message: error.message });
            } else {
                res.status(400).json({ message: error.message });
            }
        }
    }

    async getAllRoutes(req, res) {
        try {
            const routes = await this.routePersistence.getAllRoutes();
            res.status(200).json(routes);
        } catch (error) {
            Logger.error(`Error obtaining routes list: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteRoute(req, res) {
        try {
            const { id } = req.params;
            await this.routePersistence.delete(id);
            Logger.info(`Route '${id}' deleted by the user '${req.user.email}'.`)
            res.status(204).send();
        } catch (error) {
            Logger.error(`Error deleting route '${req.params.id}': ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = RouteController;