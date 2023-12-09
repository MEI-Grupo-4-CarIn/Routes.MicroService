const Joi = require('joi');

const routeSchema = Joi.object({
    userId: Joi.string().required(),
    vehicleId: Joi.string().required(),
    startPoint: Joi.object({
        city: Joi.string().required(),
        country: Joi.string().required()
    }).required(),
    endPoint: Joi.object({
        city: Joi.string().required(),
        country: Joi.string().required()
    }).required(),
    startDate: Joi.date().iso().required(),
    status: Joi.string().valid('pending', 'inProgress', 'completed', 'cancelled').required(),
    useTolls: Joi.boolean(),
    useHighways: Joi.boolean()
});

module.exports = routeSchema;