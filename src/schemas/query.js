const Joi = require("joi");

const querySchema = {
    query: Joi.object({
        title: Joi.string().messages({
            'string.base': 'invalid title',
        }),
        genre: Joi.string().messages({
            'string.base': 'invalid genre',
        }),
        duration: Joi.number().integer().messages({
            'number.base': 'invalid duration',
        }),
        rating: Joi.number().messages({
            'number.base': 'invalid rating',
        }),
        page: Joi.number().integer().messages({
            'number.base': 'invalid page',
        }),
        limit: Joi.number().integer().messages({
            'number.base': 'invalid limit',
        }),
    }),
};

module.exports = {
    querySchema,
};