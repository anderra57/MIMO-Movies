const express = require("express");
const { validatePayload } = require("../middlewares/validatePayload");
const { sessionsController } = require("../controllers/sessions");
const { sessionSchema } = require("../schemas/session");

const router = express.Router();

// POST /sessions
// summary: Iniciar sesión de usuario
router.post(
    "/",
    validatePayload(sessionSchema.createSession),
    sessionsController.login
);

module.exports = {
    sessionRoutes: router,
};
