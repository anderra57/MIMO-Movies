const Joi = require("joi");

const sessionSchema = {
    createSession: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

module.exports = {
    sessionSchema,
};
