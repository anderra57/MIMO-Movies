const { app } = require("./src/app");
const { config } = require("./src/config");
const db = require("./src/db");

async function start() {
  await db.initialize();

  app.listen(config.PORT, () => {
    console.log(`MIMO MOVIES escuchando en el puerto ${config.PORT}`);
  });
}

start();
