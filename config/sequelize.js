require("dotenv").config();
const { Sequelize } = require("sequelize");

// Instancia de conexión usando las variables de entorno existentes
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // Oculta logs ruidosos en la terminal
  },
);

// Verificación opcional de la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión con Sequelize ORM establecida exitosamente.");
  } catch (error) {
    console.error("❌ Error de conexión con Sequelize:", error.message);
  }
};

testConnection();

module.exports = sequelize;
