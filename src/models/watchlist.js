const db = require("../db");

const WatchlistModel = {
    get model() {
        return db.instance.models.Watchlist;
    },
    findAllWatchlists() {
        return this.model.findAll({
            include: [{
                model: db.instance.models.Movie,
                attributes: ['title']
            }]
        });
    },
    findWatchlistByQueryJoin(query) {
        return this.model.findAll({
            where: query,
            include: [{
                model: db.instance.models.Movie,
                attributes: ['title']
            }]
        });
    },
    findWatchlistByQuery(query) {
        return this.model.findAll({
            where: query
        });
    },
    findWatchlistItemByQuery(query) {
        return this.model.findOne({
            where: query
        });
    },
    createWatchlistItem(watchlistItem) {
        return this.model.create(watchlistItem);
    },
    deleteWatchlistItem(query) {
        return this.model.destroy({
            where: query
        });
    }
};

module.exports = {
    WatchlistModel,
};