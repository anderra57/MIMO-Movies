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
    },
    findMoviesByFilters(filters) {
        // Inicializamos la variable con un objeto where para poder
        // usar limit y offset como propiedades de la búsqueda
        const query = { where: {} };

        // Metemos los filtros en el objeto where
        if (filters.title) query.where.title = filters.title;
        if (filters.genre) query.where.genre = filters.genre;
        if (filters.duration) query.where.duration = filters.duration;
        if (filters.rating) query.where.rating = filters.rating;

        // Los filtros de paginación se añaden a la raíz del objeto query
        if (filters.limit) query.limit = filters.limit;
        if (filters.offset) query.offset = filters.offset;

        return this.model.findAll(query);
    }
};

module.exports = {
    MovieModel,
};