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
}

module.exports = RouteController;