const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");

// Rutas públicas de consulta
router.get("/", getAllOrders);
router.get("/:id", getOrderById);

// Rutas protegidas con token JWT
router.post("/", verifyToken, createOrder);
router.put("/:id", verifyToken, updateOrder);
router.delete("/:id", verifyToken, deleteOrder);

module.exports = router;
