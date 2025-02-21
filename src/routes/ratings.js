const express = require("express");
const { ratingSchema } = require("../schemas/rating");
const { ratingsController } = require("../controllers/ratings");
const { validatePayload } = require("../middlewares/validatePayload");
const router = express.Router();

// GET /movies/:movieId/ratings
// summary: Obtiene las valoraciones de una película
router.get(
    "/",
    ratingsController.getMovieRatings,
);

// POST /movies/:movieId/ratings
// summary: Crea una valoración para una película
router.post(
    "/",
    validatePayload(ratingSchema.createMovieRating),
    ratingsController.createMovieRating
);

// GET /movies/:movieId/ratings/:ratingId
// summary: Obtiene una valoración específica de una película
router.get(
    "/:ratingId",
    ratingsController.getMovieRating,
);

// PATCH /movies/:movieId/ratings/:ratingId
// summary: Modifica una valoración de una película
router.patch(
    "/:ratingId",
    validatePayload(ratingSchema.createMovieRating),
    ratingsController.updateMovieRating
);

// DELETE /movies/:movieId/ratings/:ratingId
// summary: Elimina una valoración de una película
router.delete(
    "/:ratingId",
    ratingsController.deleteMovieRating
);

module.exports = {
    ratingsRoutes: router,
};