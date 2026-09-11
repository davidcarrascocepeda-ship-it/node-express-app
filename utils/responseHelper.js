// Formateador estándar de respuestas para la API RESTful
const sendSuccess = (
  res,
  statusCode = 200,
  message = "Operación exitosa",
  data = null,
) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

const sendError = (
  res,
  statusCode = 500,
  message = "Error interno del servidor",
  error = null,
) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    data: error,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
