const Joi = require("joi");

class RouteValidator {
  static createRouteSchema = Joi.object({
    userId: Joi.string().required(),
    vehicleId: Joi.string().required(),
    startPoint: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    endPoint: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    startDate: Joi.date().iso().required(),
    status: Joi.string().valid("pending", "inProgress", "completed", "cancelled").required(),
    avoidTolls: Joi.boolean().required(),
    avoidHighways: Joi.boolean().required(),
  });

  static updateRouteSchema = Joi.object({
    userId: Joi.string(),
    vehicleId: Joi.string(),
    startDate: Joi.date().iso(),
    status: Joi.string().valid("pending", "inProgress", "completed", "cancelled"),
    avoidTolls: Joi.boolean(),
    avoidHighways: Joi.boolean(),
  }).min(1);

  static recalculateRouteSchema = Joi.object({
    action: Joi.string().valid("ROUTES_Recalculate").required(),
    data: Joi.object({
      routeId: Joi.string().required(),
      actualPosition: Joi.object({
        address: Joi.string().required(),
      }).required(),
      locationsToPass: Joi.array()
        .items(
          Joi.object({
            address: Joi.string().required(),
          })
        )
        .required(),
      finalLocation: Joi.object({
        address: Joi.string().required(),
      }).required(),
    }).required(),
  });

  static validateCreate(data) {
    return this.createRouteSchema.validate(data);
  }

  static validateUpdate(data) {
    return this.updateRouteSchema.validate(data);
  }

  static validateRecalculate(data) {
    return this.recalculateRouteSchema.validate(data);
  }
}

module.exports = RouteValidator;
