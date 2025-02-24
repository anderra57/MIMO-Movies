const { app } = require("./src/app");
const { config } = require("./src/config/config");
const db = require("./src/config/db");

async function start() {
  await db.initialize();
  await db.seedDatabase();

  app.listen(config.PORT, () => {
    console.log(`MIMO MOVIES escuchando en el puerto ${config.PORT}`);
  });
}

start();
