const { WatchlistModel } = require('../models/watchlist');
const { MovieModel } = require('../models/movie');

const watchlistController = {
    async getUserWatchlist(req, res) {
        try {
            const { params } = req;
            const userId = Number(params?.userId);

            const watchlist = await WatchlistModel.findWatchlistByQueryJoin({ userId });
            
            // Seguimos la definición en el OpenAPI para devolver los datos
            const watchlistMapeo = watchlist.map(watchlistItem => ({
                movieId: watchlistItem.movieId,
                title: watchlistItem.Movie.title,
                watched: watchlistItem.watched,
            }));
            
            res.json(watchlistMapeo);
        } catch {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    async addToWatchlist(req, res) {
        try {
            const { params } = req;
            const userId = Number(params?.userId);
            const data = req.body;
            const movieId = Number(data?.movieId);

            // Comprobar que movieId es un número
            if (!movieId || isNaN(movieId)) {
                res.status(400).json({ error: "Invalid movie id" });
                return;
            }

            // Comprobar que la película cuyo id es movieId existe
            const movie = await MovieModel.findMovieByMovieId(movieId);
            if (!movie) {
                res.status(404).json({ error: "Película no encontrada" });
                return;
            }

            // Comprobar que userId es un número
            if (!userId || isNaN(userId)) {
                res.status(400).json({ error: "Invalid user id" });
                return;
            }

            // Comprobar que el usuario userId tiene ya la película movieId en el watchlist
            const watchlistItem = await WatchlistModel.findWatchlistItemByQuery({ userId, movieId });
            if (watchlistItem) {
                res.status(409).json({ error: "La película ya existe en el watchlist" });
                return;
            }

            const watchlistItemCreate = await WatchlistModel.createWatchlistItem({
                userId,
                movieId,
                watched: data?.watched,
            });

            res.status(201).json(watchlistItemCreate);
        } catch {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    async removeFromWatchlist(req, res) {
        try {
            const { params } = req;
            const userId = Number(params?.userId);
            const itemId = Number(params?.itemId);          

            // Comprobar que userId es un número
            if (!userId || isNaN(userId)) {
                res.status(400).json({ error: "Invalid user id" });
                return;
            }

            // Comprobar que itemId es un número
            if (!itemId || isNaN(itemId)) {
                res.status(400).json({ error: "Invalid item id" });
                return;
            }

            // Comprobar que el usuario userId tiene la película movieId en el watchlist
            const watchlistItem = await WatchlistModel.findWatchlistItemByQuery({ id: itemId });
            if (!watchlistItem) {
                res.status(404).json({ error: "El item no existe" });
                return;
            }

            await WatchlistModel.deleteWatchlistItem({ id: itemId });

            res.status(204).end();
        } catch {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

module.exports = {
    watchlistController,
};