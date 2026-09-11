const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/responseHelper");

const verifyToken = (req, res, next) => {
  // Obtenemos el encabezado 'authorization'
  const authHeader = req.headers["authorization"];

  // Comprobamos si el encabezado existe
  if (!authHeader) {
    return sendError(
      res,
      401,
      "Acceso denegado: no se proporcionó un token de autenticación",
    );
  }

  // El estándar es enviar: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return sendError(
      res,
      401,
      "Formato de token inválido. Debe ser: Bearer <token>",
    );
  }

  const token = parts[1];

  try {
    // Verificamos firma y expiración con la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Inyectamos los datos del usuario decodificado en la request
    req.user = decoded;
    next(); // Permite continuar a la ruta solicitada
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(
        res,
        401,
        "El token ha expirado. Por favor inicia sesión nuevamente",
      );
    }
    return sendError(res, 403, "Token inválido o corrupto");
  }
};

module.exports = {
  verifyToken,
};
