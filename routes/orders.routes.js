const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { sendSuccess, sendError } = require("../utils/responseHelper");
const Order = require("../models/Order");

// 1. GET /api/orders (Pública o protegida: Lista todas las órdenes)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.findAll();
    return sendSuccess(res, 200, "Lista de órdenes obtenida con éxito", orders);
  } catch (error) {
    return sendError(res, 500, "Error al obtener órdenes", error.message);
  }
});

// 2. GET /api/orders/:id (Pública: Detalle de una orden)
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return sendError(res, 404, "Orden no encontrada");
    }
    return sendSuccess(res, 200, "Detalle de orden obtenido", order);
  } catch (error) {
    return sendError(res, 500, "Error al buscar orden", error.message);
  }
});

// 3. POST /api/orders (PROTEGIDA con JWT: Crear orden)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { total, producto } = req.body;
    if (!total || !producto) {
      return sendError(
        res,
        400,
        "Los campos total y producto son obligatorios",
      );
    }

    const newOrder = await Order.create({
      usuario_id: req.user.id, // Asocia la orden directamente al usuario logueado en el JWT
      producto,
      total,
      estado: "completado",
    });

    return sendSuccess(res, 201, "Orden creada exitosamente", newOrder);
  } catch (error) {
    return sendError(res, 500, "Error al crear la orden", error.message);
  }
});

// 4. PUT /api/orders/:id (PROTEGIDA con JWT: Actualizar orden)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return sendError(res, 404, "Orden no encontrada para actualizar");
    }

    const { status, total } = req.body;
    if (status) order.status = status;
    if (total) order.total = total;

    await order.save();
    return sendSuccess(res, 200, "Orden actualizada exitosamente", order);
  } catch (error) {
    return sendError(res, 500, "Error al actualizar la orden", error.message);
  }
});

// 5. DELETE /api/orders/:id (PROTEGIDA con JWT: Eliminar orden)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return sendError(res, 404, "Orden no encontrada para eliminar");
    }

    await order.destroy();
    return sendSuccess(res, 200, "Orden eliminada exitosamente", null);
  } catch (error) {
    return sendError(res, 500, "Error al eliminar la orden", error.message);
  }
});

module.exports = router;
