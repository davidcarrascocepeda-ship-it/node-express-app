const express = require("express");
const router = express.Router();

// Importamos las funciones del controlador
const { getStatus, getUsers } = require("../controllers/app.controller");

// Definición de endpoints
router.get("/status", getStatus);
router.get("/api/usuarios", getUsers);

module.exports = router;
