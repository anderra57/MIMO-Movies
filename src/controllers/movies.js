const { MovieModel } = require('../models/movie');

const moviesController = {
    async getMovies(req, res) {
        const movies = await MovieModel.findAllMovies();
        res.json(movies);
    },
};

module.exports = {
    moviesController,
};