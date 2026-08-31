const express = require("express");
const router = express.Router();

// Importamos todas las funciones del controlador
const {
  getStatus,
  getUsers,
  updateUser,
  deleteUser,
  registerUserWithHistory,
  getUsersORM,
  getUsersWithOrders,
} = require("../controllers/app.controller");

// Endpoints generales
router.get("/status", getStatus);
router.get("/usuarios", getUsers);
router.get("/api/usuarios", getUsers);

// Rutas individuales
router.put("/usuarios/:id", updateUser);
router.delete("/usuarios/:id", deleteUser);

// Ruta transaccional (Lección 4)
router.post("/usuarios/registro-completo", registerUserWithHistory);

// Ruta Lección 5: Acceso a datos con Sequelize ORM
router.get("/usuarios/orm", getUsersORM);

// Ruta para obtener usuarios y sus pedidos relacionados con Sequelize ORM
router.get("/api/usuarios-pedidos", getUsersWithOrders);

module.exports = router;
