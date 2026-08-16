// Controlador para el estado del servidor (/status)
const getStatus = (req, res) => {
  res.status(200).json({
    status: "OK",
    mensaje: "Servidor Express funcionando correctamente",
    uptime: `${process.uptime().toFixed(2)} segundos`,
    timestamp: new Date().toISOString(),
  });
};

// Controlador para la lista de usuarios (/api/usuarios)
const getUsers = (req, res) => {
  const usuarios = [
    { id: 1, nombre: "Ana García", rol: "Desarrolladora" },
    { id: 2, nombre: "Carlos López", rol: "DevOps" },
    { id: 3, nombre: "Lucía Torres", rol: "Tech Lead" },
  ];

  res.status(200).json({
    status: "success",
    total: usuarios.length,
    data: usuarios,
  });
};

module.exports = {
  getStatus,
  getUsers,
};
