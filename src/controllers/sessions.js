const { UserModel } = require("../models/user");
const { generateAccessToken, compareHashedPassword } = require("../utils/auth");

const sessionsController = {
  async login(req, res) {
    const { username, password } = req.body;

    const user = await UserModel.findUser({
      username,
    });

    // Si el usuario no existe, devolvemos un error 401
    if (!user) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    // Comparamos la contraseña con el hash almacenado en BBDD
    const isPasswordValid = await compareHashedPassword(
      password,
      user.password
    );

    // Si no coincide, devolvemos un error 401
    if (!isPasswordValid) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    // Si está todo correcto, generamos un token de acceso
    const accessToken = generateAccessToken({
      id: user.id,
    });

    // Lo devolvemos siguiendo el objeto definido en OpenAPI
    res.status(200).json({
      "token": accessToken,
    });
  },
};

module.exports = {
    sessionsController,
};
