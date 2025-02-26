const { decodeAccessToken } = require("../utils/auth");

module.exports = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ message: "Acceso no autorizado" });
    }

    const token = authHeader.split(" ")[1] ?? "";

    const decoded = decodeAccessToken(token);

    if (decoded === null) {
      return res.status(401).json({ message: "Acceso no autorizado" });
    }

    req.userId = decoded.id;
    console.log("userId: ", req.userId);

    next();
  },
};
