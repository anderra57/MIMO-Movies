const { Sequelize } = require("sequelize");
const { generateHashedPassword } = require("../auth");

const db = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
});

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

const Rating = db.define("Rating", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  movieId: {
    type: Sequelize.INTEGER,
    references: {
      model: Movie,
      key: "id",
    },
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

const WatchlistItem = db.define("Watchlist", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  movieId: {
    type: Sequelize.INTEGER,
    references: {
      model: Movie,
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

const User = db.define("User", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Definir asociaciones
Movie.hasMany(Rating, { foreignKey: "movieId" });
Rating.belongsTo(Movie, { foreignKey: "movieId" });

Movie.hasMany(WatchlistItem, { foreignKey: "movieId" });
WatchlistItem.belongsTo(Movie, { foreignKey: "movieId" });

User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

User.hasMany(WatchlistItem, { foreignKey: "userId" });
WatchlistItem.belongsTo(User, { foreignKey: "userId" });

// Hook para establecer el campo watched
WatchlistItem.addHook('beforeCreate', async (watchlist, options) => {
  const rating = await Rating.findOne({
    where: {
      movieId: watchlist.movieId,
      userId: watchlist.userId,
    },
  });
  watchlist.watched = !!rating;
});

WatchlistItem.addHook('beforeUpdate', async (watchlist, options) => {
  const rating = await Rating.findOne({
    where: {
      movieId: watchlist.movieId,
      userId: watchlist.userId,
    },
  });
  watchlist.watched = !!rating;
});

const initialize = async () => {
  await db.sync();
};

const seedDatabase = async () => {
  await Movie.create({
    title: "Test Movie",
    genre: "Test Genre",
    duration: 120,
    rating: 4.5,
  });

  await User.create({
    username: "user1",
    password: await generateHashedPassword("12345678"),
  });
  
  await Rating.create({
    userId: 1,
    movieId: 1,
    rating: 4.5,
    comment: "Test comment",
  });
};

const seedDatabaseBulk = async () => {
  const count = await Movie.count();
  if (count === 0) {
    await Movie.bulkCreate([
      { title: "Inception", genre: "Sci-Fi", duration: 148, rating: 4.8 },
      { title: "The Dark Knight", genre: "Action", duration: 152, rating: 5.0 },
      { title: "Forrest Gump", genre: "Drama", duration: 142, rating: 4.8 },
      { title: "Titanic", genre: "Romance", duration: 195, rating: 3.8 },
      { title: "Interstellar", genre: "Sci-Fi", duration: 169, rating: 4.6 },
      { title: "The Matrix", genre: "Sci-Fi", duration: 136, rating: 4.7 },
      { title: "Gladiator", genre: "Action", duration: 155, rating: 4.5 },
      { title: "The Godfather", genre: "Crime", duration: 175, rating: 5.0 },
      { title: "The Shawshank Redemption", genre: "Drama", duration: 142, rating: 5.0 },
      { title: "Pulp Fiction", genre: "Crime", duration: 154, rating: 4.9 },
    ]);
    console.log("Mock data insertado en la base de datos.");

    const users = [];
    const password = await generateHashedPassword("12345678");
    for (let i = 1; i <= 10; i++) {
      users.push({
        id: i,
        username: `user${i}`,
        password
      });
      console.log(`Usuario insertado: username: user${i}, password: ${password}`);
    }
    await User.bulkCreate(users);

    const movies = await Movie.findAll();
    const ratings = [];
    const watchlists = [];
    for (const movie of movies) {
      if(movie.id === 1) {
        // dejo libre el id=1 para probar los createMovieRating
        continue
      }
      const numRatings = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numRatings; i++) {
        ratings.push({
          userId: Math.floor(Math.random() * 10) + 1,
          movieId: movie.id,
          rating: (Math.random() * 5).toFixed(1),
          comment: "Comentario de ejemplo",
        });
      }
    }
    await Rating.bulkCreate(ratings);

    // Añadir películas al watchlist de los usuarios 1-10 solo si watched está activado
    for (const movie of movies) {
      for (let userId = 1; userId <= 10; userId++) {
        const rating = ratings.find(r => r.movieId === movie.id && r.userId === userId);
        if (rating) { // Solo añadir si hay un rating, es decir, si watched está activado
          watchlists.push({
            userId,
            movieId: movie.id,
            watched: true, // watched está activado
          });
        }
      }
    }
    await WatchlistItem.bulkCreate(watchlists);
    console.log("Ratings y Watchlist mock data insertado en la base de datos.");
  } else {
    console.log("Los datos ya existen, no se insertaron nuevamente.");
  }
};

module.exports = {
  instance: db,
  initialize,
  seedDatabase,
  seedDatabaseBulk,
};