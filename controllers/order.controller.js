const Order = require("../models/Order");
const { sendSuccess, sendError } = require("../utils/responseHelper");

// 1. Obtener todas las órdenes
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    return sendSuccess(res, 200, "Lista de órdenes obtenida con éxito", orders);
  } catch (error) {
    return sendError(res, 500, "Error al obtener órdenes", error.message);
  }
};

// 2. Obtener una orden por ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return sendError(res, 404, "Orden no encontrada");
    }
    return sendSuccess(res, 200, "Detalle de orden obtenido", order);
  } catch (error) {
    return sendError(res, 500, "Error al buscar orden", error.message);
  }
};

// 3. Crear una nueva orden (asociada al usuario del token)
const createOrder = async (req, res) => {
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
      usuario_id: req.user.id,
      producto,
      total,
      estado: "completado",
    });

    return sendSuccess(res, 201, "Orden creada exitosamente", newOrder);
  } catch (error) {
    return sendError(res, 500, "Error al crear la orden", error.message);
  }
};

// 4. Actualizar una orden existente
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return sendError(res, 404, "Orden no encontrada para actualizar");
    }

    const { estado, total, producto } = req.body;
    if (estado) order.estado = estado;
    if (total) order.total = total;
    if (producto) order.producto = producto;

    await order.save();
    return sendSuccess(res, 200, "Orden actualizada exitosamente", order);
  } catch (error) {
    return sendError(res, 500, "Error al actualizar la orden", error.message);
  }
};

// 5. Eliminar una orden
const deleteOrder = async (req, res) => {
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
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
