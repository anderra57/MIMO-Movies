const express = require("express");
const { watchlistController } = require("../controllers/watchlist");
const { watchlistSchema } = require("../schemas/watchlist");
const { validatePayload } = require("../middlewares/validatePayload");
const router = express.Router();

// GET /watchlist/:userId
// summary: Obtiene el watchlist de un usuario
router.get(
    "/:userId",
    watchlistController.getUserWatchlist,
);

// POST /watchlist/:userId/items
// summary: Añadir una película al watchlist de un usuario
router.post(
    "/:userId/items",
    validatePayload(watchlistSchema.WatchlistItemInput),
    watchlistController.addToWatchlist,
);

// DELETE /watchlist/:userId/items/:itemId
// summary: Elimina una película del watchlist de un usuario
router.delete(
    "/:userId/items/:itemId",
    watchlistController.removeFromWatchlist,
);

module.exports = {
    watchlistRoutes: router,
};