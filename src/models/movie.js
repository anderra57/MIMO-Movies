const db = require("../db");

const MovieModel = {
    get model() {
        return db.instance.models.Movie;
    },
    findAllMovies() {
        return this.model.findAll();
    }
};

module.exports = {
    MovieModel,
};