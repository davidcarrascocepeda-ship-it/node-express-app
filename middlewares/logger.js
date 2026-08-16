// Importamos el módulo nativo 'fs' para interactuar con el sistema de archivos
const fs = require("fs");
// Importamos 'path' para manejar rutas de directorios de manera segura y multiplataforma
const path = require("path");

// Middleware para registrar las visitas al servidor en un archivo de texto plano
const requestLogger = (req, res, next) => {
  // Obtenemos la fecha y hora actual en formato ISO legible
  const timestamp = new Date().toLocaleString("es-CL", {
    timeZone: "America/Santiago",
  });
  const method = req.method;
  const url = req.originalUrl || req.url;

  // Estructura requerida: fecha, hora, método y ruta accedida
  const logMessage = `[${timestamp}] Método: ${method} | Ruta: ${url}\n`;

  // Ruta absoluta al archivo de logs
  const logFilePath = path.join(__dirname, "../logs/log.txt");

  // Usamos fs.appendFile para añadir el texto al final del archivo sin borrar lo anterior
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error al escribir en el archivo de log:", err);
    }
  });

  // Continuamos con el siguiente middleware o controlador de la petición
  next();
};

module.exports = requestLogger;
