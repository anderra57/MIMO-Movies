module.exports = {
  notFoundHandler: (req, res) => {
    res.status(404).json({ error: "Not Found" });
  },
};
