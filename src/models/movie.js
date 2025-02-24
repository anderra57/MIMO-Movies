const db = require("../config/db");

const MovieModel = {
    get model() {
        return db.instance.models.Movie;
    },
    findAllMovies() {
        return this.model.findAll();
    },
    findMovieByMovieId(movieId) {
        return this.model.findByPk(movieId);
    }
};

module.exports = {
    MovieModel,
};