const db = require("../config/db");

const RatingModel = {
    get model() {
        return db.instance.models.Rating;
    },
    findAllRatings() {
        return this.model.findAll();
    },
    findAllRatingsByMovieId(query) {
        return this.model.findAll({
            where: query,
        });
    },
    createRating(rating) {
      return this.model.create(rating);
    },
    findRatingByRatingId(ratingId) {
        return this.model.findByPk(ratingId);
    },
    findRatingByRatingIdAndMovieId(query) {
        return this.model.findOne({
            where: query,
        });
    },
    updateRating(query, updatedValues) {
        return this.model.update(updatedValues, {
            where: query,
        });
    },
    deleteRating(query) {
        return this.model.destroy({
            where: query,
        });
    }
};

module.exports = {
    RatingModel,
};