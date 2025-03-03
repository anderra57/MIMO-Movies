const Joi = require("joi");

const paramsSchema = {
    movie: Joi.object({
        movieId: Joi.string().regex(/^[0-9]+$/).required().messages({
            'string.pattern.base': 'invalid movieId',
            'any.required': 'movieId is required'
        }),
    }),
    movieAndRating: Joi.object({
        movieId: Joi.string().regex(/^[0-9]+$/).required().messages({
            'string.pattern.base': 'invalid movieId',
            'any.required': 'movieId is required'
        }),
        ratingId: Joi.string().regex(/^[0-9]+$/).required().messages({
            'string.pattern.base': 'invalid ratingId',
            'any.required': 'ratingId is required'
        }),
    }),
    user: Joi.object({
        userId: Joi.string().regex(/^[0-9]+$/).required().messages({
            'string.pattern.base': 'invalid userId',
            'any.required': 'userId is required'
        }),
    }),
    userAndItem: Joi.object({
        userId: Joi.string().regex(/^[0-9]+$/).required().messages({
            'string.pattern.base': 'invalid userId',
            'any.required': 'userId is required'
        }),
        itemId: Joi.string().regex(/^[0-9]+$/).required().messages({
            'string.pattern.base': 'invalid itemId',
            'any.required': 'itemId is required'
        }),
    }),
};

module.exports = {
    paramsSchema,
};