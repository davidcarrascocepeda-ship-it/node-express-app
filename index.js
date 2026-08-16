// ==========================================
// SERVIDOR PRINCIPAL CON NODE.JS Y EXPRESS
// ==========================================

// 1. Importación de dependencias
const express = require("express");
const dotenv = require("dotenv");

// 2. Cargar las variables de entorno definidas en el archivo .env
dotenv.config();

// 3. Crear la instancia de la aplicación Express
const app = express();

// 4. Configurar el puerto de escucha (toma el valor de .env o 3000 por defecto)
const PORT = process.env.PORT || 3000;

// ==========================================
// SECCIÓN DE MIDDLEWARES
// ==========================================

// Middleware nativo para transformar las solicitudes con cuerpo JSON en objetos JavaScript
app.use(express.json());

// Middleware personalizado de registro (Logger): registra método, ruta y fecha de cada solicitud
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Método: ${req.method} | Ruta: ${req.url}`);
  next(); // Pasa el control a la siguiente función o ruta
});

// ==========================================
// SECCIÓN DE RUTAS / ENDPOINTS
// ==========================================

// Ruta raíz (GET /): Endpoint de bienvenida y comprobación de estado
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: "Servidor Express ejecutándose correctamente",
    version: "1.0.0",
  });
});

// Ruta de usuarios (GET /api/usuarios): Endpoint de ejemplo con datos simulados
app.get("/api/usuarios", (req, res) => {
  const usuarios = [
    { id: 1, nombre: "Ana López", rol: "Desarrolladora" },
    { id: 2, nombre: "Carlos Soto", rol: "Diseñador UI/UX" },
    { id: 3, nombre: "María Rojas", rol: "Project Manager" },
  ];

  res.status(200).json({
    ok: true,
    total: usuarios.length,
    datos: usuarios,
  });
});

// ==========================================
// ARRANQUE DEL SERVIDOR
// ==========================================

// Iniciar el servidor y escuchar peticiones en el puerto configurado
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` Servidor activo y escuchando en: http://localhost:${PORT}`);
  console.log(` Presiona Ctrl + C en la terminal para detenerlo`);
  console.log(`===============================================`);
});
