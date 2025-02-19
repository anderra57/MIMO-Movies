const { app } = require("./src/app");
const db = require("./src/db");

const PORT = process.env.PORT || 3000;

async function start() {
  await db.initialize();

  app.listen(PORT, () => {
    console.log(`MIMO MOVIES escuchando en el puerto ${PORT}`);
  });
}

start();
