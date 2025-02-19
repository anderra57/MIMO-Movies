const { Sequelize } = require("sequelize");

const db = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
});

module.exports = {
  get instance() {
    return db;
  },
  initialize() {
    db.define("Movie", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });

    db.define("Rating", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
          max: 5,
        },
      },
      comment: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
    });

    db.define("Watchlist", {
      movieId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Movie",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      watched: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });

    return db.sync();
  },
};