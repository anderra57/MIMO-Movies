const express = require("express");
const { ratingSchema } = require("../schemas/rating");
const { ratingsController } = require("../controllers/ratings");
const { validatePayload } = require("../middlewares/validatePayload");
const { verifyToken } = require("../middlewares/verifyToken");
const { paramsSchema } = require("../schemas/params");
const { validateParams } = require("../middlewares/validateParams");

const router = express.Router();

// verifyToken: Middleware para verificar el token de autenticación
// NO se usa en todos los métodos de este router
// Por lo tanto, se define en cada método que lo requiera

// GET /movies/:movieId/ratings
// summary: Obtiene las valoraciones de una película
router.get(
    "/:movieId/ratings/",
    validateParams(paramsSchema.movie),
    ratingsController.getMovieRatings,
);

// POST /movies/:movieId/ratings
// summary: Crea una valoración para una película
router.post(
    "/:movieId/ratings/",
    verifyToken,
    validateParams(paramsSchema.movie),
    validatePayload(ratingSchema.createMovieRating),
    ratingsController.createMovieRating
);

// GET /movies/:movieId/ratings/:ratingId
// summary: Obtiene una valoración específica de una película
router.get(
    "/:movieId/ratings/:ratingId",
    validateParams(paramsSchema.movieAndRating),
    ratingsController.getMovieRating,
);

// PATCH /movies/:movieId/ratings/:ratingId
// summary: Modifica una valoración de una película
router.patch(
    "/:movieId/ratings/:ratingId",
    verifyToken,
    validateParams(paramsSchema.movieAndRating),
    validatePayload(ratingSchema.createMovieRating),
    ratingsController.updateMovieRating
);

// DELETE /movies/:movieId/ratings/:ratingId
// summary: Elimina una valoración de una película
router.delete(
    "/:movieId/ratings/:ratingId",
    verifyToken,
    validateParams(paramsSchema.movieAndRating),
    ratingsController.deleteMovieRating
);

module.exports = {
    ratingsRoutes: router,
};