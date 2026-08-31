// Importamos el pool de conexión a MySQL
const pool = require("../config/db");
const { User, Order } = require("../models");

// Controlador para el estado del servidor (/status)
const getStatus = (req, res) => {
  res.status(200).json({
    status: "OK",
    mensaje: "Servidor Express funcionando correctamente",
    uptime: `${process.uptime().toFixed(2)} segundos`,
    timestamp: new Date().toISOString(),
  });
};

// Controlador para obtener usuarios (GET)
const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, email, createdAt FROM usuarios",
    );
    res.status(200).json({
      status: "success",
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Error al consultar usuarios:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor al obtener usuarios",
      error: error.message,
    });
  }
};

// Controlador para actualizar un usuario (PUT /usuarios/:id)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({
      status: "error",
      message:
        "Los campos 'nombre' y 'email' son obligatorios para actualizar.",
    });
  }

  try {
    const [result] = await pool.query(
      "UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?",
      [nombre, email, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: `No se encontró ningún usuario con el ID ${id}.`,
      });
    }

    res.status(200).json({
      status: "success",
      message: `Usuario con ID ${id} actualizado correctamente.`,
      data: { id: Number(id), nombre, email },
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor al actualizar usuario",
      error: error.message,
    });
  }
};

// Controlador para eliminar un usuario (DELETE /usuarios/:id)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: `No se encontró ningún usuario con el ID ${id}.`,
      });
    }

    res.status(200).json({
      status: "success",
      message: `Usuario con ID ${id} eliminado correctamente de la base de datos.`,
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor al eliminar usuario",
      error: error.message,
    });
  }
};

// Controlador con Transacción: Registro de usuario + Registro de historial (Lección 4)
const registerUserWithHistory = async (req, res) => {
  const { nombre, email, password, forzarError } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Nombre, email y password son obligatorios.",
    });
  }

  // Obtenemos una conexión exclusiva del pool para la transacción
  const connection = await pool.getConnection();

  try {
    // 1. Iniciamos la transacción
    await connection.beginTransaction();

    // 2. Paso 1: Insertar el usuario
    const [userResult] = await connection.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, password],
    );
    const nuevoUsuarioId = userResult.insertId;

    // Simulación de fallo para comprobar el Rollback
    if (forzarError === true) {
      throw new Error(
        "Fallo simulado en el segundo paso para probar el Rollback.",
      );
    }

    // 3. Paso 2: Insertar en el historial
    await connection.query(
      "INSERT INTO historial_usuarios (usuario_id, accion, detalle) VALUES (?, ?, ?)",
      [
        nuevoUsuarioId,
        "CREACION_CUENTA",
        "Usuario registrado exitosamente en el sistema.",
      ],
    );

    // 4. Si ambos pasos fueron exitosos, confirmamos la transacción
    await connection.commit();

    res.status(201).json({
      status: "success",
      message: "Transacción completada: Usuario e historial registrados.",
      data: {
        id: nuevoUsuarioId,
        nombre,
        email,
      },
    });
  } catch (error) {
    // Si ocurre cualquier error, revertimos todos los cambios
    await connection.rollback();
    console.error("Transacción abortada (Rollback ejecutado):", error.message);

    res.status(500).json({
      status: "error",
      message:
        "Transacción fallida. Se aplicó ROLLBACK y no se guardaron cambios.",
      error: error.message,
    });
  } finally {
    // Liberamos la conexión de vuelta al pool
    connection.release();
  }
};

// Controlador ORM: Obtener usuarios con Sequelize (Lección 5)
const getUsersORM = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "nombre", "email", "createdAt"],
    });

    res.status(200).json({
      status: "success",
      source: "Sequelize ORM",
      total: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error al consultar usuarios con ORM:", error.message);
    res.status(500).json({
      status: "error",
      message: "Error interno al obtener usuarios mediante ORM",
      error: error.message,
    });
  }
};

// ==========================================
// LECCIÓN 6: MANEJO DE RELACIONES CON ORM (SEQUELIZE)
// ==========================================
const getUsersWithOrders = async (req, res) => {
  try {
    const usersWithOrders = await User.findAll({
      attributes: ["id", "nombre", "email"],
      include: [
        {
          model: Order,
          as: "pedidos",
          attributes: ["id", "producto", "total"],
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      message:
        "Usuarios y sus pedidos obtenidos exitosamente mediante Sequelize ORM",
      data: usersWithOrders,
    });
  } catch (error) {
    console.error("Error al obtener usuarios con pedidos:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor al consultar relaciones con ORM",
      error: error.message,
    });
  }
};

module.exports = {
  getStatus,
  getUsers,
  updateUser,
  deleteUser,
  registerUserWithHistory,
  getUsersORM,
  getUsersWithOrders,
};
