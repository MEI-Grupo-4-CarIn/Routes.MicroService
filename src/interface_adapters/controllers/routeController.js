const RoutePersistence = require('../../use_cases/routePersistence');
const NotFoundError = require('../../utils/notFoundError');

class RouteController {
    constructor() {
        this.routePersistence = new RoutePersistence();
    }

    async createRoute(req, res) {
        try {
            const route = await this.routePersistence.create(req.body);
            res.status(201).json(route);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateRoute(req, res) {
        try {
            const { id } = req.params;
            const updatedRoute = await this.routePersistence.update(id, req.body);
            res.status(200).json(updatedRoute);
        } catch (error) {
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
            res.status(500).json({ message: error.message });
        }
    }

    async deleteRoute(req, res) {
        try {
            const { id } = req.params;
            await this.routePersistence.delete(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = RouteController;