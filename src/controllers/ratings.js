const { RatingModel } = require('../models/rating');
const { MovieModel } = require('../models/movie');

const ratingsController = {
    async getMovieRatings(req, res) {
        try{
            const movieId = parseInt(req.movieId);

            // Comprobar que movieId es un número
            if (!movieId || isNaN(movieId)) {
                res.status(400).json({ error: "Invalid movie id" });
                return;
            }

            // Comprobar que la película cuyo id es movieId existe
            const movie = await MovieModel.findMovieByMovieId(movieId);
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
                return;
            }

            const ratings = await RatingModel.findAllRatingsByMovieId({ movieId });
            
            // Seguimos la definición en el OpenAPI para devolver los datos
            const ratingsMapeo = ratings.map(rating => ({
                id: rating.id,
                userId: rating.userId,
                rating: rating.rating,
                comment: rating.comment,
            }));
            
            res.json(ratingsMapeo);
        } catch {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    async createMovieRating(req, res) {
        try {
            const movieId = parseInt(req.movieId);
            const data = req.body;

            // Comprobar que movieId es un número
            if (!movieId || isNaN(movieId)) {
                res.status(400).json({ error: "Invalid movie id" });
                return;
            }
            
            // Comprobar que la película cuyo id es movieId existe
            const movie = await MovieModel.findMovieByMovieId(movieId);
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
                return;
            }

            // todo userId debe ser el id del usuario autenticado
            const userId = 99;

            const rating = await RatingModel.createRating({
                rating: data?.rating,
                comment: data?.comment,
                userId,
                movieId,
            });

            res.status(201).json(rating);
        } catch {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    async getMovieRating(req, res) {
        try {
            const movieId = parseInt(req.movieId);
            const { params } = req;
            const ratingId = parseInt(params?.ratingId);

            // Comprobar que movieId es un número
            if (!movieId || isNaN(movieId)) {
                res.status(400).json({ error: "Invalid movie id" });
                return;
            }

            // Comprobar que la película cuyo id es movieId existe
            const movie = await MovieModel.findMovieByMovieId(movieId);
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
                return;
            }

            // Comprobar que ratingId es un número
            if (!ratingId || isNaN(ratingId)) {
                res.status(400).json({ error: "Invalid rating id" });
                return;
            }

            // Buscar que la valoración exista Y ADEMÁS que pertenezca a la película
            const rating = await RatingModel.findRatingByRatingIdAndMovieId(
                {
                    id: ratingId,
                    movieId
                }
            );

            if (!rating) {
                res.status(404).json({ error: "Rating not found" });
                return;
            }

            // Seguimos la definición en el OpenAPI para devolver los datos
            const ratingMapeo = {
                id: rating.id,
                userId: rating.userId,
                rating: rating.rating,
                comment: rating.comment,
            };
            
            res.json(ratingMapeo);
        } catch {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    async updateMovieRating(req, res) {
        try {
            const movieId = parseInt(req.movieId);
            const { params } = req;
            const ratingId = parseInt(params?.ratingId);
            const data = req.body;

            // Comprobar que movieId es un número
            if (!movieId || isNaN(movieId)) {
                res.status(400).json({ error: "Invalid movie id" });
                return;
            }

            // Comprobar que la película cuyo id es movieId existe
            const movie = await MovieModel.findMovieByMovieId(movieId);
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
                return;
            }

            // Comprobar que ratingId es un número
            if (!ratingId || isNaN(ratingId)) {
                res.status(400).json({ error: "Invalid rating id" });
                return;
            }

            // Actualizar la valoración
            const [affectedRows] = await RatingModel.updateRating(
                {
                    // query
                    id: ratingId,
                    movieId
                },
                {
                    // updatedValues
                    rating: data?.rating,
                    comment: data?.comment,
                }
            );

            if (affectedRows === 0) {
                res.status(404).json({ error: "Rating not found" });
                return;
            }

            const rating = await RatingModel.findRatingByRatingIdAndMovieId({
                id: ratingId,
                movieId,
            });

            res.json(rating);
        } catch {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    async deleteMovieRating(req, res) {
        try {
            const movieId = parseInt(req.movieId);
            const { params } = req;
            const ratingId = parseInt(params?.ratingId);

            // Comprobar que movieId es un número
            if (!movieId || isNaN(movieId)) {
                res.status(400).json({ error: "Invalid movie id" });
                return;
            }

            // Comprobar que la película cuyo id es movieId existe
            const movie = await MovieModel.findMovieByMovieId(movieId);
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
                return;
            }

            // Comprobar que ratingId es un número
            if (!ratingId || isNaN(ratingId)) {
                res.status(400).json({ error: "Invalid rating id" });
                return;
            }

            // Eliminar la valoración
            const affectedRows = await RatingModel.deleteRating({
                id: ratingId,
                movieId,
            });

            if (affectedRows === 0) {
                res.status(404).json({ error: "Rating not found" });
                return;
            }

            res.status(204).end();
        } catch {
            res.status(500).json({ error: "Error interno del servidor" });
        }
    } 
};

module.exports = {
    ratingsController,
};