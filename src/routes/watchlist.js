const express = require("express");
const router = express.Router();

// GET /watchlist/:userId
// summary: Obtiene el watchlist de un usuario
router.get(
    "/:userId",
    (req, res) => {
      const { userId } = req.params;
      res.json({
        message: `GET /watchlist/${userId}`,
      });
    }
);

// POST /watchlist/:userId/items
// summary: Añadir una película al watchlist de un usuario
router.post(
    "/:userId/items",
    (req, res) => {
      const { userId } = req.params;
      res.status(201).json({
        message: `POST /watchlist/${userId}/items`,
      });
    }
);

// DELETE /watchlist/:userId/items/:itemId
// summary: Elimina una película del watchlist de un usuario
router.delete(
    "/:userId/items/:itemId",
    (req, res) => {
      const { userId, itemId } = req.params;
      res.status(204).json({
        message: `DELETE /watchlist/${userId}/items/${itemId}`,
      });
    }
);

module.exports = {
    watchlistRoutes: router,
};