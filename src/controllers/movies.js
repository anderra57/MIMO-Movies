const { MovieModel } = require('../models/movie');
const { Op } = require("sequelize");

const moviesController = {
    async getMovies(req, res) {
        const filters = {};

        // Paginación
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);
        if (!isNaN(page) && !isNaN(limit)) {
            // limit: la cantidad de elementos
            filters.limit = limit;
            // offset: cuánto desplazamiento tiene el elemento inicial
            filters.offset = (page - 1) * limit;
        }

        // Filtros
        // Usamos el operador like y la función % para buscar coincidencias parciales
        if (req.query.title) filters.title = { [Op.like]: '%'+req.query.title+'%' };
        if (req.query.genre) filters.genre = { [Op.like]: '%'+req.query.genre+'%' };
        if (req.query.duration) filters.duration = Number(req.query.duration);
        // Por la manera de gestionar los números decimales en MySQL, se tiene que buscar con el operador between
        const rating = Number(req.query.rating);
        if (req.query.rating) filters.rating = { [Op.between]: [rating - 0.01, rating + 0.01] };

        const movies = await MovieModel.findMoviesByFilters(filters);
        res.json(movies);
    },
};

module.exports = {
    moviesController,
};