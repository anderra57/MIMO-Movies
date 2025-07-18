const { RatingModel } = require('../models/rating');
const { MovieModel } = require('../models/movie');

const ratingsController = {
    async getMovieRatings(req, res) {
        try{
            const { params } = req;
            const movieId = Number(params?.movieId);

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
            const { params } = req;
            const movieId = Number(params?.movieId);
            const data = req.body;
            
            // Comprobar que la película cuyo id es movieId existe
            const movie = await MovieModel.findMovieByMovieId(movieId);
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
                return;
            }

            const userId = req.userId;

            const rating = await RatingModel.createRating({
                rating: data?.rating,
                comment: data?.comment,
                userId,
                movieId,
            });

            res.status(201).json(rating);
        } catch (e) {
            res.status(500).json({ error: "Error interno del servidor: " + e });
        }
    },
    async getMovieRating(req, res) {
        try {
            const { params } = req;
            const movieId = Number(params?.movieId);
            const ratingId = Number(params?.ratingId);

            // Comprobar que la película cuyo id es movieId existe
            const movie = await MovieModel.findMovieByMovieId(movieId);
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
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
            const { params } = req;
            const movieId = Number(params?.movieId);
            const ratingId = Number(params?.ratingId);
            const data = req.body;

            // Comprobar que la película cuyo id es movieId existe
            const movie = await MovieModel.findMovieByMovieId(movieId);
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
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
            const { params } = req;
            const movieId = Number(params?.movieId);
            const ratingId = Number(params?.ratingId);

            // Comprobar que la película cuyo id es movieId existe
            const movie = await MovieModel.findMovieByMovieId(movieId);
            if (!movie) {
                res.status(404).json({ error: "Movie not found" });
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