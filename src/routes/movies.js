const express = require("express");
const { moviesController } = require("../controllers/movies");
const router = express.Router();

// GET /movies
// summary: Obtiene la lista de películas
router.get(
    "/",
    // (req, res) => {
    //   res.json({
    //     message: "GET /movies",
    //   });
    // }
    moviesController.getMovies
);

module.exports = {
    moviesRoutes: router,
};