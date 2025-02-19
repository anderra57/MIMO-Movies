const express = require("express");
const router = express.Router();

// GET /movies
// summary: Obtiene la lista de películas
router.get(
    "/",
    (req, res) => {
      res.json({
        message: "GET /movies",
      });
    }
);

module.exports = {
    moviesRoutes: router,
};