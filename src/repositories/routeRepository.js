const RouteModel = require("../frameworks/database/routeModel");
const lodash = require("lodash");

class RouteRepository {
  async getById(id) {
    // Exclude deleted routes
    const document = await RouteModel.findById(id).where("isDeleted").equals(false);
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
      // Exclude deleted routes
      let query = { isDeleted: false };

      if (search) {
        const escapedSearch = lodash.escapeRegExp(search);
        const searchPattern = new RegExp(escapedSearch, "i");

        query.$text = { $search: searchPattern };
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
    // Marks the route as deleted
    await RouteModel.findByIdAndUpdate(id, { isDeleted: true });
  }

  async find(query) {
    // Exclude deleted routes
    query.isDeleted = false;

    return RouteModel.find(query).exec();
  }
}

module.exports = RouteRepository;
