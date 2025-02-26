const app = require("./app");
const { config } = require("./config/config");
const db = require("./config/db");

async function start() {
  await db.initialize();
  await db.seedDatabase();

  app.listen(config.PORT, () => {
    console.log(`MIMO MOVIES escuchando en el puerto ${config.PORT}`);
  });
}

start();