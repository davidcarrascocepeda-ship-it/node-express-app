# Node & Express Web App - API RESTful (Módulo 8 - ABP)

API RESTful modular construida con Node.js, Express y Sequelize ORM para la gestión de usuarios, órdenes y carga de archivos, implementando seguridad stateless con JWT y persistencia en MySQL.

---

## Stack Tecnológico

- **Entorno de Ejecución:** Node.js (v18+)
- **Framework Web:** Express.js
- **Base de Datos & ORM:** MySQL con Sequelize ORM
- **Autenticación & Hashing:** JSON Web Tokens (JWT) y bcryptjs
- **Manejo de Archivos:** Multer (almacenamiento en disco, filtros MIME y límite de 2MB)
- **Persistencia en Archivos Planos:** Middleware nativo con `fs` para logs de peticiones

---

## Estructura del Proyecto

```text
node-express-app/
├── config/             # Configuración de conexión Sequelize a MySQL
├── controllers/        # Lógica de negocio (auth, orders, app)
├── logs/               # Archivos planos de auditoría (log.txt)
├── middlewares/        # verifyToken, logger, upload.middleware
├── models/             # Esquemas y asociaciones Sequelize (User, Order)
├── public/             # Archivos estáticos frontend
├── routes/             # Enrutamiento modular (auth, orders, app)
├── uploads/            # Archivos multimedia subidos por Multer
├── utils/              # responseHelper.js (respuestas estandarizadas)
├── .env                # Variables de entorno (excluido en .gitignore)
├── .env.example        # Plantilla de variables de entorno
├── index.js            # Punto de entrada principal
└── package.json        # Dependencias y scripts

---

## Instalación y Puesta en Marcha

1. **Clonar el repositorio:**
    git clone https://github.com/davidcarrascocepeda-ship-it/node-express-app.git


```
