module.exports = (req, res, next) => {
    const { movieId } = req.params;
    if (movieId) {
      req.movieId = movieId;
    }
    next();
};