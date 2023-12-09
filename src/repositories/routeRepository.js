const RouteModel = require('../frameworks/database/routeModel');

class RouteRepository {
    async getById(id) {
        return await RouteModel.findById(id);
    }

    async create(route) {
        const newRoute = new RouteModel(route);
        return await newRoute.save();
    }
}

module.exports = RouteRepository;