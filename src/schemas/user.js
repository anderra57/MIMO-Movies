const Joi = require("joi");

const userSchema = {
    createUser: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required().min(12),
    }),
};

module.exports = {
    userSchema,
};
