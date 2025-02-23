const Joi = require("joi");

const watchlistSchema = {
    WatchlistItemInput: Joi.object({
        movieId: Joi.number().integer().min(1).required(),
        watched: Joi.boolean().default(false)
    }),
};

module.exports = {
    watchlistSchema,
};
