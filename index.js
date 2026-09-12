// ==========================================
// SERVIDOR PRINCIPAL CON NODE.JS Y EXPRESS (MODULAR)
// ==========================================

// 1. Carga de variables de entorno
require("dotenv").config();

// 2. Importación de módulos y dependencias
const express = require("express");
const path = require("path");
require("./config/db");

// Importación de modelos y ORM
const { sequelize } = require("./models");

// 3. Importación de middlewares personalizados y rutas modulares
const requestLogger = require("./middlewares/logger");
const appRoutes = require("./routes/app.routes");
const authRoutes = require("./routes/auth.routes");

// 4. Inicialización de la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// SECCIÓN DE MIDDLEWARES GLOBALES
// ==========================================

// Parseo de cuerpos de solicitud en formato JSON
app.use(express.json());

// Registro de peticiones y persistencia en archivo plano (logs/log.txt)
app.use(requestLogger);

// Servicio de archivos estáticos (sirve public/index.html en la raíz '/')
app.use(express.static(path.join(__dirname, "public")));

// Servicio estático para acceder a las imágenes subidas por Multer
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================================
// SECCIÓN DE ENRUTAMIENTO MODULAR
// ==========================================

// Conexión del router principal (/status, /api/usuarios)
app.use("/", appRoutes);

// Rutas de autenticación y carga de archivos (/api/auth)
app.use("/api/auth", authRoutes);

// ==========================================
// SINCRONIZACIÓN ORM Y ARRANQUE DEL SERVIDOR
// ==========================================

// Sincroniza modelos con la base de datos
sequelize
  .sync()
  .then(() => {
    console.log(" Modelos de Sequelize sincronizados con la base de datos.");

    app.listen(PORT, () => {
      console.log("===============================================");
      console.log(` Servidor activo y escuchando en: http://localhost:${PORT}`);
      console.log(" Presiona Ctrl + C en la terminal para detenerlo");
      console.log("===============================================");
    });
  })
  .catch((error) => {
    console.error(" Error al sincronizar con Sequelize:", error.message);
  });
