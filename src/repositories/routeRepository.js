const RouteModel = require("../frameworks/database/routeModel");

class RouteRepository {
  async getById(id) {
    const document = await RouteModel.findById(id);
    return document ? document.toObject() : null;
  }

  async create(route) {
    const newRoute = new RouteModel(route);
    return await newRoute.save();
  }

  async update(id, updatedRouteData) {
    const updatedRoute = await RouteModel.findByIdAndUpdate(id, updatedRouteData, { new: true });
    return updatedRoute;
  }

  async getAll(perPage, page, search, status) {
    try {
      let query = {};
      if (search) {
        const searchPattern = new RegExp(search, "i");

        query.$or = [
          { "startPoint.city": { $regex: searchPattern } },
          { "startPoint.country": { $regex: searchPattern } },
          { "endPoint.city": { $regex: searchPattern } },
          { "endPoint.country": { $regex: searchPattern } },
        ];
      }
      if (status) {
        query.status = status;
      }

      const options = {
        skip: (page - 1) * perPage,
        limit: parseInt(perPage, 10),
      };

      const allRoutes = await RouteModel.find(query, null, options).exec();
      return allRoutes;
    } catch (error) {
      throw new Error(`Error getting all routes from the repository: ${error.message}`);
    }
  }

  async delete(id) {
    const deletedRoute = await RouteModel.findByIdAndDelete(id);
    return deletedRoute;
  }

  async find(query) {
    return RouteModel.find(query).exec();
  }
}

module.exports = RouteRepository;
