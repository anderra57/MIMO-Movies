const express = require("express");
const { moviesRoutes } = require("./routes/movies");
const { ratingsRoutes } = require("./routes/ratings");
const { watchlistRoutes } = require("./routes/watchlist");
const { sessionRoutes } = require("./routes/sessions");
const { errorHandler } = require("./middlewares/errorHandler");
const { notFoundHandler } = require("./middlewares/notFoundHandler");
const { respondTo } = require("./middlewares/respondTo");

const app = express();

app.use(express.json());
app.use(respondTo("application/json"));
app.use(errorHandler);
app.use("/movies", ratingsRoutes);
app.use("/movies", moviesRoutes);
app.use("/watchlist", watchlistRoutes);
app.use("/sessions", sessionRoutes);
// Para el despliegue en AWS
app.use("/health", (_, res) => res.status(200).send("OK"));
app.use(notFoundHandler);

module.exports = app;
