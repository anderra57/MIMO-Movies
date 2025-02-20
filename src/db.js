const { Sequelize } = require("sequelize");

const db = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
});

module.exports = {
  get instance() {
    return db;
  },
  async initialize() {
    const Movie = db.define("Movie", {
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

    await db.sync();

    // Insertar mock data si no hay películas
    const count = await Movie.count();
    if (count === 0) {
      await Movie.bulkCreate([
        { title: "Inception", genre: "Sci-Fi", duration: 148, rating: 8.8 },
        { title: "The Dark Knight", genre: "Action", duration: 152, rating: 9.0 },
        { title: "Forrest Gump", genre: "Drama", duration: 142, rating: 8.8 },
        { title: "Titanic", genre: "Romance", duration: 195, rating: 7.8 },
        { title: "Interstellar", genre: "Sci-Fi", duration: 169, rating: 8.6 },
        { title: "The Matrix", genre: "Sci-Fi", duration: 136, rating: 8.7 },
        { title: "Gladiator", genre: "Action", duration: 155, rating: 8.5 },
        { title: "The Godfather", genre: "Crime", duration: 175, rating: 9.2 },
        { title: "The Shawshank Redemption", genre: "Drama", duration: 142, rating: 9.3 },
        { title: "Pulp Fiction", genre: "Crime", duration: 154, rating: 8.9 },
      ]);
      console.log("Mock data insertado en la base de datos.");
    } else {
      console.log("Los datos ya existen, no se insertaron nuevamente.");
    }
  },
};