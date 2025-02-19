const express = require("express");
const router = express.Router();

// GET /movies/:movieId/ratings
// summary: Obtiene las valoraciones de una película
router.get(
    "/:movieId/ratings",
    (req, res) => {
      const { movieId } = req.params;
      res.json({
        message: `GET /movies/${movieId}/ratings`,
      });
    }
);

// POST /movies/:movieId/ratings
// summary: Crea una valoración para una película
router.post(
    "/:movieId/ratings",
    (req, res) => {
      const { movieId } = req.params;
      res.status(201).json({
        message: `POST /movies/${movieId}/ratings`,
      });
    }
);

// GET /movies/:movieId/ratings/:ratingId
// summary: Obtiene una valoración específica de una película
router.get(
    "/:movieId/ratings/:ratingId",
    (req, res) => {
      const { movieId, ratingId } = req.params;
      res.json({
        message: `GET /movies/${movieId}/ratings/${ratingId}`,
      });
    }
);

// PATCH /movies/:movieId/ratings/:ratingId
// summary: Modifica una valoración de una película
router.patch(
    "/:movieId/ratings/:ratingId",
    (req, res) => {
      const { movieId, ratingId } = req.params;
      res.json({
        message: `PATCH /movies/${movieId}/ratings/${ratingId}`,
      });
    }
);

// DELETE /movies/:movieId/ratings/:ratingId
// summary: Elimina una valoración de una película
router.delete(
    "/:movieId/ratings/:ratingId",
    (req, res) => {
      const { movieId, ratingId } = req.params;
      res.status(204).json({
        message: `DELETE /movies/${movieId}/ratings/${ratingId}`,
      });
    }
);

module.exports = {
    ratingsRoutes: router,
};