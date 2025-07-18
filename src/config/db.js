const { Sequelize } = require("sequelize");
const { generateHashedPassword } = require("../utils/auth");

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./src/utils/database.sqlite",
});

const db2 = new Sequelize({
  dialect: "mysql",
  host: process.env.MYSQL_HOST || "mimo-movies.c76gm8yu295x.eu-south-2.rds.amazonaws.com",
  database: process.env.MYSQL_DATABASE || "mimomovies",
  username: process.env.MYSQL_USER || "admin",
  password: process.env.MYSQL_PASSWORD || "admin-mimo-movies",
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

// Hook para establecer el campo watched al añadir o actualizar un WatchlistItem
// Si existe un rating con el mismo movieId y userId, ponemos watched a true,
// independientemente del valor que tuviera a la hora de mandar la petición
const updateWatchedBeforeWatchlist = async (watchlist) => {
  const rating = await Rating.findOne({
    where: {
      movieId: watchlist.movieId,
      userId: watchlist.userId,
    },
  });
  watchlist.watched = !!rating;
};
WatchlistItem.addHook('beforeCreate', async (watchlist, options) => {
  await updateWatchedBeforeWatchlist(watchlist);
});

WatchlistItem.addHook('beforeUpdate', async (watchlist, options) => {
  await updateWatchedBeforeWatchlist(watchlist);
});

// Hook para actualizar el campo watched en WatchlistItem al crear o actualizar un Rating
// Si hay un watchlistItem con el mismo movieId y userId, ponemos watched a true
const updateWatchedAfterRating = async (rating) => {
  const watchlistItem = await WatchlistItem.findOne({
    where: {
      movieId: rating.movieId,
      userId: rating.userId,
    },
  });
  if (watchlistItem) {
    watchlistItem.watched = true;
    await watchlistItem.save();
  }
};

Rating.addHook('afterCreate', async (rating, options) => {
  await updateWatchedAfterRating(rating);
});

Rating.addHook('afterUpdate', async (rating, options) => {
  await updateWatchedAfterRating(rating.movieId, rating.userId);
});

const initialize = async () => {
  await db.sync();
};

const seedDatabase = async () => {
  const count = await Movie.count();
  // Ejecutar solo si no hay datos en la base de datos
  if (count === 0) {
    // Insertamos las películas
    await Movie.bulkCreate([
      { title: "El laberinto del fauno", genre: "Fantasía", duration: 118, rating: 4.9 },
      { title: "Los otros", genre: "Terror", duration: 101, rating: 4.6 },
      { title: "Ocho apellidos vascos", genre: "Comedia", duration: 98, rating: 4.2 },
      { title: "Celda 211", genre: "Drama", duration: 113, rating: 4.8 },
      { title: "Tesis", genre: "Suspense", duration: 125, rating: 4.7 },
      { title: "Rec", genre: "Terror", duration: 78, rating: 4.5 },
      { title: "Mar adentro", genre: "Drama", duration: 125, rating: 4.9 },
      { title: "El secreto de sus ojos", genre: "Suspense", duration: 129, rating: 5.0 },
      { title: "La comunidad", genre: "Comedia", duration: 110, rating: 4.3 },
      { title: "Campeones", genre: "Comedia", duration: 124, rating: 4.4 },
      { title: "El orfanato", genre: "Terror", duration: 105, rating: 4.7 },
      { title: "La isla mínima", genre: "Suspense", duration: 104, rating: 4.8 },
      { title: "Palmeras en la nieve", genre: "Drama", duration: 163, rating: 4.6 },
      { title: "El día de la bestia", genre: "Comedia", duration: 103, rating: 4.5 },
      { title: "Volver", genre: "Drama", duration: 121, rating: 4.7 },
      { title: "Todo sobre mi madre", genre: "Drama", duration: 101, rating: 4.8 },
      { title: "Carmina o revienta", genre: "Comedia", duration: 70, rating: 4.1 },
      { title: "La lengua de las mariposas", genre: "Drama", duration: 96, rating: 4.9 },
      { title: "Quién te cantará", genre: "Drama", duration: 124, rating: 4.4 },
      { title: "El hombre de las mil caras", genre: "Suspense", duration: 123, rating: 4.3 },
      { title: "Mientras dure la guerra", genre: "Drama", duration: 107, rating: 4.6 },
      { title: "Balada triste de trompeta", genre: "Drama", duration: 107, rating: 4.2 },
      { title: "El fotógrafo de Mauthausen", genre: "Drama", duration: 110, rating: 4.5 },
      { title: "Primos", genre: "Comedia", duration: 98, rating: 4.2 },
      { title: "Que Dios nos perdone", genre: "Suspense", duration: 125, rating: 4.7 },
      { title: "El bar", genre: "Suspense", duration: 102, rating: 4.3 },
      { title: "La trinchera infinita", genre: "Drama", duration: 147, rating: 4.8 },
      { title: "Perfectos desconocidos", genre: "Comedia", duration: 96, rating: 4.4 },
      { title: "La piel que habito", genre: "Suspense", duration: 120, rating: 4.6 },
      { title: "El autor", genre: "Drama", duration: 112, rating: 4.2 },
      { title: "Intemperie", genre: "Drama", duration: 103, rating: 4.5 },
      { title: "Contratiempo", genre: "Suspense", duration: 106, rating: 4.9 },
      { title: "Orígenes secretos", genre: "Suspense", duration: 97, rating: 4.3 },
      { title: "Adú", genre: "Drama", duration: 119, rating: 4.7 },
      { title: "Explota explota", genre: "Comedia", duration: 111, rating: 4.0 },
      { title: "El silencio de la ciudad blanca", genre: "Suspense", duration: 110, rating: 4.2 },
    ]);

    // Creamos tres usuarios para poder hacer pruebas
    await User.create({
      username: "user1",
      password: await generateHashedPassword("12345678"),
    });

    await User.create({
      username: "user2",
      password: await generateHashedPassword("12345678"),
    });

    await User.create({
      username: "user3",
      password: await generateHashedPassword("12345678"),
    });
    
    // Insertamos una valoración de prueba
    await Rating.create({
      userId: 1,
      movieId: 1,
      rating: 4.5,
      comment: "Test comment",
    });
  }
};

module.exports = {
  instance: db,
  initialize,
  seedDatabase,
};