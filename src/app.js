const express = require("express");
const { moviesRoutes } = require("./routes/movies");
const { ratingsRoutes } = require("./routes/ratings");
const { watchlistRoutes } = require("./routes/watchlist");
const { errorHandler } = require("./middlewares/errorHandler");
const { notFoundHandler } = require("./middlewares/notFoundHandler");
const { respondTo } = require("./middlewares/respondTo");
const movieIdHandler = require("./middlewares/movieIdHandler");
const { sessionRoutes } = require("./routes/sessions");

const app = express();

app.use(express.json());
app.use(respondTo("application/json"));
app.use(errorHandler);
app.use("/movies/:movieId/ratings", movieIdHandler, ratingsRoutes);
app.use("/movies", moviesRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/sessions", sessionRoutes);
app.use(notFoundHandler);

module.exports = {
  app,
};
