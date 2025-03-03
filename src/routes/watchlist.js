const express = require("express");
const { watchlistController } = require("../controllers/watchlist");
const { watchlistSchema } = require("../schemas/watchlist");
const { validatePayload } = require("../middlewares/validatePayload");
const { verifyToken } = require("../middlewares/verifyToken");
const { paramsSchema } = require("../schemas/params");
const { validateParams } = require("../middlewares/validateParams");
const router = express.Router();

// Middleware para verificar el token de autenticación
// Se usa en todos los métodos de este router
router.use(verifyToken)

// GET /watchlist/:userId
// summary: Obtiene el watchlist de un usuario
router.get(
    "/:userId",
    validateParams(paramsSchema.user),
    watchlistController.getUserWatchlist,
);

// POST /watchlist/:userId/items
// summary: Añadir una película al watchlist de un usuario
router.post(
    "/:userId/items",
    validateParams(paramsSchema.user),
    validatePayload(watchlistSchema.WatchlistItemInput),
    watchlistController.addToWatchlist,
);

// DELETE /watchlist/:userId/items/:itemId
// summary: Elimina una película del watchlist de un usuario
router.delete(
    "/:userId/items/:itemId",
    validateParams(paramsSchema.userAndItem),
    watchlistController.removeFromWatchlist,
);

module.exports = {
    watchlistRoutes: router,
};