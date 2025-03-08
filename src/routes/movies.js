const express = require("express");
const { moviesController } = require("../controllers/movies");
const { validateQuery } = require("../middlewares/validateQuery");
const { querySchema } = require("../schemas/query");
const router = express.Router();

// GET /movies
// summary: Obtiene la lista de películas
router.get(
    "/",
    validateQuery(querySchema.query),
    moviesController.getMovies
);

module.exports = {
    moviesRoutes: router,
};